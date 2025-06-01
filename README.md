
# 📥 Full-Stack File Downloader & Crawler App

A powerful full-stack application that crawls web directories (like h5ai file servers) and downloads all files while preserving folder structure.

## ✨ Features

- **Directory Crawling**: Automatically crawls h5ai-style directory listings
- **Sequential Downloads**: Downloads files one by one to avoid overwhelming servers
- **Folder Structure Preservation**: Maintains original directory hierarchy locally
- **Real-time Progress**: Live updates via WebSocket connection
- **Recursive Downloads**: Optional subdirectory crawling
- **Modern UI**: Dark theme with beautiful progress indicators
- **Error Handling**: Robust error handling with retry capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Start the Backend Server**:
```bash
cd server
npm install
npm start
```

2. **Start the Frontend** (in a new terminal):
```bash
npm run dev
```

3. **Open your browser** and navigate to `http://localhost:8080`

## 📖 How to Use

1. **Paste Directory URL**: Enter an HTTP directory URL (e.g., from an h5ai file server)
2. **Configure Options**: Toggle recursive download if you want subdirectories
3. **Start Download**: Click the download button to begin crawling and downloading
4. **Monitor Progress**: Watch real-time status updates for each file
5. **Check Downloads**: Files are saved to the `downloads/` directory

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Socket.IO
- **Backend**: Node.js + Express + Socket.IO + Cheerio
- **Real-time Communication**: WebSocket for live progress updates
- **File Handling**: Sequential downloads with progress tracking

## 📁 Project Structure

```
├── src/                   # React frontend
│   ├── pages/Index.tsx    # Main download interface
│   └── ...
├── server/                # Node.js backend
│   ├── server.js          # Express + Socket.IO server
│   └── package.json       # Backend dependencies
├── downloads/             # Downloaded files (auto-created)
└── README.md
```

## 🔧 Configuration

The app works with various directory listing formats:
- h5ai file servers
- Apache directory listings
- nginx autoindex
- Custom directory pages

## 🛠️ Development

To run in development mode:

**Backend**:
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

**Frontend**:
```bash
npm run dev  # Vite dev server with hot reload
```

## 📝 API Endpoints

- `POST /api/download` - Start download process
  - Body: `{ "url": "http://example.com/dir/", "recursive": true }`

## 🔌 WebSocket Events

- `fileQueued` - File added to download queue
- `fileDownloading` - File download in progress
- `fileCompleted` - File successfully downloaded
- `fileFailed` - File download failed
- `downloadComplete` - All downloads finished

## ⚠️ Important Notes

- Files are downloaded to the `downloads/` directory
- The app respects server rate limits by downloading sequentially
- Large files may take time - progress is shown in real-time
- Failed downloads are logged and can be retried

## 🎯 Example URLs

Try these types of directory URLs:
```
http://example.com/files/
https://fileserver.domain.com/media/movies/
http://192.168.1.100/shared/documents/
```

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the application!
