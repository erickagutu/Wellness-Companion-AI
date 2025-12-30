
import React from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserProfile } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };
  
  const handleProfileReset = () => {
    setUserProfile(null);
    localStorage.removeItem('healthLog');
    localStorage.removeItem('aiRecommendations');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-text font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wellness Companion AI</h1>
          </div>
          {userProfile && (
             <button
              onClick={handleProfileReset}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Reset Profile
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {userProfile ? (
          <Dashboard userProfile={userProfile} />
        ) : (
          <Onboarding onOnboardingComplete={handleOnboardingComplete} />
        )}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>This is a demo application. Consult a healthcare professional for medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
