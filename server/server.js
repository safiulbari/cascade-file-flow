const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { createWriteStream } = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const DOWNLOADS_DIR = path.join(__dirname, '../downloads');

// File extensions we want to download
const VIDEO_EXTENSIONS = ['.mkv', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

// Combine all supported extensions
const SUPPORTED_EXTENSIONS = [...VIDEO_EXTENSIONS, ...IMAGE_EXTENSIONS];

// Function to decode URL-encoded filenames
function decodeFilename(filename) {
  try {
    return decodeURIComponent(filename);
  } catch (error) {
    // If decoding fails, return original filename
    return filename;
  }
}

// Ensure downloads directory exists
async function ensureDownloadsDir() {
  try {
    await fs.access(DOWNLOADS_DIR);
  } catch {
    await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
  }
}

// Check if URL is from the same domain to avoid external links
function isSameDomain(baseUrl, targetUrl) {
  try {
    const base = new URL(baseUrl);
    const target = new URL(targetUrl);
    return base.hostname === target.hostname;
  } catch {
    return false;
  }
}

// Check if file is supported (video or image)
function isSupportedFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

// Extract file links from h5ai-style directory listing
async function crawlDirectory(url, recursive = true) {
  try {
    console.log(`Crawling: ${url}`);
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const files = [];
    const directories = [];

    // Specific selectors for h5ai structure
    $('#items li.item').each((i, element) => {
      const $item = $(element);
      const $link = $item.find('a').first();
      const href = $link.attr('href');
      const $label = $item.find('.label');
      const rawFilename = $label.attr('title') || $label.text().trim();
      
      if (href && rawFilename) {
        const fullUrl = new URL(href, url).href;
        
        // Skip if not from same domain
        if (!isSameDomain(url, fullUrl)) {
          console.log(`Skipping external link: ${fullUrl}`);
          return;
        }
        
        // Decode the filename
        const filename = decodeFilename(rawFilename);
        
        // Check if it's a folder
        if ($item.hasClass('folder') && !$item.hasClass('folder-parent')) {
          if (recursive) {
            directories.push({ url: fullUrl, name: filename });
          }
        } 
        // Check if it's a file and a supported file type
        else if ($item.hasClass('file') && isSupportedFile(filename)) {
          files.push({
            url: fullUrl,
            filename: filename,
            relativePath: getRelativePath(url, fullUrl, true) // true to decode path
          });
          console.log(`Found supported file: ${filename}`);
        } else if ($item.hasClass('file')) {
          console.log(`Skipping unsupported file: ${filename}`);
        }
      }
    });

    // Fallback: try generic selectors if h5ai specific didn't work
    if (files.length === 0 && directories.length === 0) {
      console.log('Falling back to generic selectors...');
      
      $('a[href]').each((i, element) => {
        const href = $(element).attr('href');
        const rawText = $(element).text().trim();
        
        if (href && href !== '../' && !href.startsWith('?') && !href.startsWith('#') && rawText.length > 0) {
          const fullUrl = new URL(href, url).href;
          
          // Skip if not from same domain
          if (!isSameDomain(url, fullUrl)) {
            return;
          }
          
          const text = decodeFilename(rawText);
          
          if (href.endsWith('/')) {
            if (recursive && text !== 'Parent Directory' && !text.includes('Sort')) {
              directories.push({ url: fullUrl, name: text });
            }
          } else if (isSupportedFile(text)) {
            files.push({
              url: fullUrl,
              filename: text,
              relativePath: getRelativePath(url, fullUrl, true)
            });
            console.log(`Found supported file: ${text}`);
          }
        }
      });
    }

    console.log(`Found ${files.length} supported files and ${directories.length} directories`);

    // Recursively crawl subdirectories
    if (recursive) {
      for (const dir of directories) {
        try {
          const subFiles = await crawlDirectory(dir.url, true);
          files.push(...subFiles);
        } catch (error) {
          console.error(`Failed to crawl directory ${dir.url}:`, error.message);
        }
      }
    }

    return files;
  } catch (error) {
    console.error(`Failed to crawl ${url}:`, error.message);
    throw error;
  }
}

function getRelativePath(baseUrl, fileUrl, decode = false) {
  try {
    const base = new URL(baseUrl);
    const file = new URL(fileUrl);
    let relativePath = file.pathname.replace(base.pathname, '').replace(/^\//, '');
    return decode ? decodeFilename(relativePath) : relativePath;
  } catch {
    const filename = path.basename(fileUrl);
    return decode ? decodeFilename(filename) : filename;
  }
}

async function downloadFile(file, socket, customFolder) {
  const { url, filename, relativePath } = file;
  const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    socket.emit('fileQueued', { id: fileId, filename: relativePath || filename });

    // Create directory structure with custom folder
    const filePath = path.join(DOWNLOADS_DIR, customFolder, relativePath || filename);
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    socket.emit('fileDownloading', { id: fileId, progress: 0 });

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const totalSize = parseInt(response.headers['content-length'], 10);
    let downloadedSize = 0;

    const writer = createWriteStream(filePath);

    response.data.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (totalSize) {
        const progress = Math.round((downloadedSize / totalSize) * 100);
        socket.emit('fileDownloading', { id: fileId, progress });
      }
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const sizeInMB = (downloadedSize / (1024 * 1024)).toFixed(2);
        socket.emit('fileCompleted', { 
          id: fileId, 
          size: `${sizeInMB} MB` 
        });
        resolve({ success: true, size: downloadedSize });
      });

      writer.on('error', (error) => {
        socket.emit('fileFailed', { 
          id: fileId, 
          error: error.message 
        });
        reject(error);
      });

      response.data.on('error', (error) => {
        socket.emit('fileFailed', { 
          id: fileId, 
          error: error.message 
        });
        reject(error);
      });
    });

  } catch (error) {
    socket.emit('fileFailed', { 
      id: fileId, 
      error: error.message 
    });
    throw error;
  }
}

// ... keep existing code (formatBytes, formatDuration functions) the same

app.post('/api/download', async (req, res) => {
  const { url, recursive = true, folderName } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!folderName) {
    return res.status(400).json({ error: 'Folder name is required' });
  }

  res.json({ message: 'Download started' });

  // Get socket connection for this client
  const socket = io;

  try {
    await ensureDownloadsDir();
    
    // Crawl directory to get file list
    const files = await crawlDirectory(url, recursive);
    
    if (files.length === 0) {
      socket.emit('downloadError', { error: 'No supported files (videos/images) found in directory' });
      return;
    }

    console.log(`Found ${files.length} supported files to download`);
    
    const startTime = Date.now();
    let completedFiles = 0;
    let failedFiles = 0;
    let totalSize = 0;

    // Download files sequentially
    for (const file of files) {
      try {
        const result = await downloadFile(file, socket, folderName);
        if (result.success) {
          completedFiles++;
          totalSize += result.size;
        }
      } catch (error) {
        failedFiles++;
        console.error(`Failed to download ${file.filename}:`, error.message);
      }
    }

    const duration = formatDuration(Date.now() - startTime);
    const summary = {
      totalFiles: files.length,
      completedFiles,
      failedFiles,
      totalSize: formatBytes(totalSize),
      duration
    };

    socket.emit('downloadComplete', summary);
    console.log('Download complete:', summary);

  } catch (error) {
    console.error('Download process failed:', error);
    socket.emit('downloadError', { error: error.message });
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Downloads will be saved to: ${DOWNLOADS_DIR}`);
});
