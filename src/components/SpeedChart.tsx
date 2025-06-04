import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SpeedData {
  time: string;
  speed: number;
}

interface SpeedChartProps {
  currentSpeed: number;
  isDownloading: boolean;
}

const SpeedChart: React.FC<SpeedChartProps> = ({ currentSpeed, isDownloading }) => {
  const [speedHistory, setSpeedHistory] = useState<SpeedData[]>([]);

  useEffect(() => {
    if (!isDownloading) {
      setSpeedHistory([]);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour12: false });
      
      setSpeedHistory(prev => {
        const newData = [...prev, { time: timeString, speed: currentSpeed }];
        // Keep only last 20 data points
        return newData.slice(-20);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSpeed, isDownloading]);

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2 text-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Speed Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {speedHistory.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedHistory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip 
                  labelFormatter={(value) => `Time: ${value}`}
                  formatter={(value: number) => [`${value.toFixed(1)} MB/s`, 'Speed']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm">Start downloading to see speed chart</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeedChart;
