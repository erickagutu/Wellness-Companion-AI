
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import Label from './common/Label';

interface OnboardingProps {
  onOnboardingComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onOnboardingComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    occupation: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    if (!profile.name) newErrors.name = 'Name is required.';
    if (profile.age <= 0) newErrors.age = 'Please enter a valid age.';
    if (profile.height <= 0) newErrors.height = 'Please enter a valid height.';
    if (profile.weight <= 0) newErrors.weight = 'Please enter a valid weight.';
    if (!profile.occupation) newErrors.occupation = 'Occupation is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onOnboardingComplete(profile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome!</h2>
          <p className="text-center text-gray-600 mb-6">Let's set up your wellness profile to get started.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" name="name" id="name" value={profile.name} onChange={handleChange} placeholder="e.g., Jane Doe" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input type="number" name="age" id="age" value={profile.age === 0 ? '' : profile.age} onChange={handleChange} placeholder="e.g., 30" />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input type="number" name="height" id="height" value={profile.height === 0 ? '' : profile.height} onChange={handleChange} placeholder="e.g., 165" />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input type="number" name="weight" id="weight" value={profile.weight === 0 ? '' : profile.weight} onChange={handleChange} placeholder="e.g., 60" />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input type="text" name="occupation" id="occupation" value={profile.occupation} onChange={handleChange} placeholder="e.g., Software Developer" />
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
            </div>
            <div className="pt-2">
              <Button type="submit" fullWidth>
                Get Started
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
