
import React, { useState } from 'react';
import { HealthLogEntry } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Label from './common/Label';
import Input from './common/Input';

interface DailyCheckInProps {
  onSubmit: (entry: Omit<HealthLogEntry, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const MoodSelector: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => {
  const moods = [
    { value: 1, emoji: '😞', label: 'Very Unhappy' },
    { value: 2, emoji: '😕', label: 'Unhappy' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '😄', label: 'Very Happy' },
  ];
  return (
    <div className="flex justify-between items-center space-x-2">
      {moods.map(mood => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          className={`p-2 rounded-full transition-transform transform hover:scale-110 ${value === mood.value ? 'bg-primary/20 ring-2 ring-primary' : 'bg-gray-100'}`}
          aria-label={mood.label}
        >
          <span className="text-3xl">{mood.emoji}</span>
        </button>
      ))}
    </div>
  );
};


const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onSubmit, isLoading }) => {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [bloodSugar, setBloodSugar] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ mood, energy, bloodSugar, notes });
  };

  return (
    <Card>
        <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Check-in</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label>How are you feeling today?</Label>
                    <MoodSelector value={mood} onChange={setMood} />
                </div>

                <div>
                    <Label>How are your energy levels? (1=Low, 5=High)</Label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={energy}
                            onChange={(e) => setEnergy(parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                         <span className="font-bold text-primary w-4 text-center">{energy}</span>
                    </div>
                </div>

                <div>
                    <Label htmlFor="bloodSugar">Blood Sugar (mg/dL) - Optional</Label>
                    <Input
                        type="number"
                        id="bloodSugar"
                        value={bloodSugar === undefined ? '' : bloodSugar}
                        onChange={(e) => setBloodSugar(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                        placeholder="e.g., 95"
                    />
                </div>

                <div>
                    <Label htmlFor="notes">Any additional notes?</Label>
                    <textarea
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Had a great workout, feeling a bit stressed..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    ></textarea>
                </div>
                
                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? 'Generating Insights...' : 'Submit & Get AI Insights'}
                </Button>
            </form>
        </div>
    </Card>
  );
};

export default DailyCheckIn;