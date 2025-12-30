
import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { HealthLogEntry, UserProfile } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Label from './common/Label';

interface DataExplorerProps {
  logEntries: HealthLogEntry[];
  userProfile: UserProfile;
}

const DataExplorer: React.FC<DataExplorerProps> = ({ logEntries, userProfile }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minMood, setMinMood] = useState(1);

  const filteredEntries = useMemo(() => {
    return logEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && entryDate < start) return false;
      if (end && entryDate > end) return false;
      if (entry.mood < minMood) return false;
      
      return true;
    });
  }, [logEntries, startDate, endDate, minMood]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Wellness Report for ${userProfile.name}`, 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    (doc as any).autoTable({
      startY: 30,
      head: [['Date', 'Mood', 'Energy', 'Blood Sugar', 'Notes']],
      body: filteredEntries.map(e => [
        new Date(e.date).toLocaleDateString(),
        e.mood,
        e.energy,
        e.bloodSugar ?? 'N/A',
        e.notes,
      ]),
    });

    doc.save(`wellness-report-${userProfile.name.replace(' ', '-')}-${Date.now()}.pdf`);
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Data Explorer</h3>
        
        <div className="space-y-4 mb-4 p-4 border rounded-md">
          <h4 className="font-semibold">Filter Data</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Minimum Mood: {minMood}</Label>
            <input
                type="range" min="1" max="5" step="1"
                value={minMood}
                onChange={(e) => setMinMood(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto mb-4 border rounded-md">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-4 py-2">Date</th>
                <th scope="col" className="px-4 py-2">Mood</th>
                <th scope="col" className="px-4 py-2">Energy</th>
                <th scope="col" className="px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id} className="bg-white border-b">
                  <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{entry.mood}</td>
                  <td className="px-4 py-2">{entry.energy}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{entry.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Button onClick={handleExportPDF} fullWidth disabled={filteredEntries.length === 0}>
          {filteredEntries.length > 0 ? `Export ${filteredEntries.length} Entries to PDF` : 'No Data to Export'}
        </Button>

      </div>
    </Card>
  );
};

export default DataExplorer;
