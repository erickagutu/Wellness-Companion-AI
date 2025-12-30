
import React, { useState, useEffect } from 'react';
import { UserProfile, HealthLogEntry, AIResponse } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import DailyCheckIn from './DailyCheckIn';
import AIRecommendations from './AIRecommendations';
import HealthLog from './HealthLog';
import DataExplorer from './DataExplorer';
import { getAIRecommendations } from '../services/geminiService';

interface DashboardProps {
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const [healthLog, setHealthLog] = useLocalStorage<HealthLogEntry[]>('healthLog', []);
  const [recommendations, setRecommendations] = useLocalStorage<AIResponse | null>('aiRecommendations', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastCheckInDate = healthLog.length > 0 ? new Date(healthLog[0].date).toDateString() : null;
  const todayDate = new Date().toDateString();
  const hasCheckedInToday = lastCheckInDate === todayDate;

  useEffect(() => {
    if (healthLog.length > 0 && !recommendations && !hasCheckedInToday) {
        // This case handles loading recommendations for past logs if they were never generated.
        // For this app, we'll primarily generate on new check-in.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckInSubmit = async (entry: Omit<HealthLogEntry, 'id' | 'date'>) => {
    setIsLoading(true);
    setError(null);
    const newEntry: HealthLogEntry = {
      ...entry,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    
    try {
      const aiResponse = await getAIRecommendations(userProfile, newEntry);
      setRecommendations(aiResponse);
      setHealthLog([newEntry, ...healthLog]);
    } catch (err) {
      setError('Failed to get AI recommendations. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Hello, {userProfile.name}!</h2>
        <p className="text-gray-600 mt-1">Ready to check in on your wellness today?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {!hasCheckedInToday && <DailyCheckIn onSubmit={handleCheckInSubmit} isLoading={isLoading} />}
            {hasCheckedInToday && (
                 <div className="bg-teal-100 border-l-4 border-teal-500 text-teal-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">All Set for Today!</p>
                    <p>You've completed your check-in. Great job focusing on your well-being!</p>
                </div>
            )}
            
            <AIRecommendations recommendations={recommendations} isLoading={isLoading} error={error} />
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <HealthLog logEntries={healthLog} />
          <DataExplorer logEntries={healthLog} userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;