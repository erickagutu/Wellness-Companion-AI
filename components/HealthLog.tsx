
import React from 'react';
import { HealthLogEntry } from '../types';
import Card from './common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthLogProps {
  logEntries: HealthLogEntry[];
}

const HealthLog: React.FC<HealthLogProps> = ({ logEntries }) => {
  const chartData = logEntries.slice(0, 7).reverse().map(entry => ({
    name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Mood: entry.mood,
    Energy: entry.energy,
  }));

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Wellness Journey</h3>
        
        {logEntries.length > 0 ? (
          <>
            <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Mood" stroke="#40B5AD" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Energy" stroke="#F69E7B" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {logEntries.map(entry => (
                <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-sm text-gray-700">{new Date(entry.date).toLocaleDateString()}</p>
                  <div className="flex space-x-4 text-sm mt-1">
                    <p>Mood: {entry.mood}/5</p>
                    <p>Energy: {entry.energy}/5</p>
                  </div>
                  {entry.notes && <p className="text-sm text-gray-600 mt-2 italic">"{entry.notes}"</p>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-8">Your check-in history will appear here. Let's start by logging your first entry!</p>
        )}
      </div>
    </Card>
  );
};

export default HealthLog;