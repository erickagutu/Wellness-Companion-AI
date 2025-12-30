
import React from 'react';
import { AIResponse } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import Button from './common/Button';

interface AIRecommendationsProps {
  recommendations: AIResponse | null;
  isLoading: boolean;
  error: string | null;
}

const HealthTipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-2.714 4.223a2 2 0 01-1.28 1.037H4a2 2 0 00-2 2v3a2 2 0 002 2h2.586a1 1 0 01.928.658l1.87 3.991M14 10h-2" />
    </svg>
);
const MentalWellnessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-1.414a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 18a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);
const ProductIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);


const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations, isLoading, error }) => {
  if (isLoading) {
    return <Card><div className="p-6 flex flex-col items-center justify-center space-y-4"><Spinner /><p className="text-gray-600">Our AI is crafting personalized recommendations for you...</p></div></Card>;
  }

  if (error) {
    return <Card><div className="p-6 text-red-600 bg-red-50 rounded-lg">{error}</div></Card>;
  }

  if (!recommendations) {
    return <Card><div className="p-6 text-center text-gray-500">Complete your daily check-in to receive personalized AI insights.</div></Card>;
  }

  const handleActionClick = (url: string, source: 'internal' | 'external') => {
    if (source === 'external') {
       if (window.confirm('This will take you to an external shopping site. Do you want to continue?')) {
         window.open(url, '_blank');
       }
    } else {
      // Internal link handling (e.g., open a modal) could go here. For now, we'll just log it.
      alert(`Viewing internal product: ${url}`);
    }
  };

  const handleLearnMoreClick = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  const handleShareClick = async (text: string) => {
    const shareData = {
      title: 'Wellness Tip from Companion AI',
      text: `Here's a great wellness tip: "${text}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('Tip copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Could not copy tip to clipboard.');
      }
    }
  };


  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your AI-Powered Insights</h3>
        <div className="space-y-6">
          
          <div>
            <h4 className="font-semibold text-lg flex items-center space-x-2 mb-2"><HealthTipIcon /><span>Health Tips</span></h4>
            <ul className="space-y-2 text-gray-700">
              {recommendations.healthTips.map((tip, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span className="flex-1 pr-4">{tip}</span>
                  <div className="flex space-x-2 flex-shrink-0">
                    <Button
                      onClick={() => handleLearnMoreClick(tip)}
                      variant="secondary"
                      className="!py-1 !px-3 !text-xs"
                    >
                      Learn More
                    </Button>
                     <Button
                      onClick={() => handleShareClick(tip)}
                      variant="tertiary"
                      className="!py-1 !px-3 !text-xs"
                    >
                      Share
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg flex items-center space-x-2 mb-2"><MentalWellnessIcon/><span>Mental Wellness Suggestions</span></h4>
            <ul className="space-y-2 text-gray-700">
              {recommendations.mentalWellnessSuggestions.map((suggestion, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                  <span className="flex-1 pr-4">{suggestion}</span>
                   <div className="flex space-x-2 flex-shrink-0">
                    <Button
                      onClick={() => handleLearnMoreClick(suggestion)}
                      variant="secondary"
                      className="!py-1 !px-3 !text-xs"
                    >
                      Learn More
                    </Button>
                     <Button
                      onClick={() => handleShareClick(suggestion)}
                      variant="tertiary"
                      className="!py-1 !px-3 !text-xs"
                    >
                      Share
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg flex items-center space-x-2 mb-2"><ProductIcon/><span>Product Recommendations</span></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.productRecommendations.map((product, index) => {
                const imageUrl = `https://placehold.co/400x300/${product.source === 'internal' ? '40B5AD' : 'F69E7B'}/white?text=${encodeURIComponent(product.category)}`;
                return (
                  <div key={index} className="border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover bg-gray-200"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      </div>
                      <div className="pt-4">
                        <span className={`text-xs ${product.source === 'internal' ? 'bg-primary/20 text-teal-800' : 'bg-secondary/20 text-orange-800'} px-2 py-0.5 rounded-full mb-3 inline-block`}>
                          {product.source === 'internal' ? 'Curated' : 'E-Commerce'}
                        </span>
                        <Button
                          onClick={() => handleActionClick(product.link, product.source)}
                          className="w-full !py-1 !text-sm"
                          variant={product.source === 'internal' ? 'primary' : 'secondary'}
                        >
                          {product.source === 'internal' ? 'View Product' : 'Shop Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default AIRecommendations;