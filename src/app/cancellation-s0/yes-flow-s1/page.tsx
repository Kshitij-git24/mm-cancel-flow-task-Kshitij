'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import CancellationContext  from '@/context/CancellationContext'; // Assume this file exists

export default function CancellationS0() {
  // const [user, setUser] = useState<any>(null);
  const [step] = useState(1);
  const router = useRouter();
  const context = useContext(CancellationContext);

  if (!context) {
    throw new Error('CancellationContext is undefined. Ensure the component is wrapped in CancellationProvider.');
  }

  const { responses, setResponses, user } = context;

  console.log(user)

  // useEffect(() => {
  //   const loginAndFetchUser = async () => {
  //     // Step 1: Login (simplified for example)
  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email: "testuser@example.com",
  //       password: "NewStrongPassword123!",
  //     });

  //     if (error) {
  //       console.error("Login error:", error.message);
  //       return;
  //     }

  //     console.log("Logged in:", data);
  //     const { data: userData, error: userError } = await supabase.auth.getUser();
  //     if (userError) {
  //       console.error("Error fetching user:", userError.message);
  //       return;
  //     }
  //     setUser(userData.user);
  //   };
  //   loginAndFetchUser();
  // }, []);

  const handleChange = (question: keyof typeof responses, value: string) => {
    setResponses(prev => ({ ...prev, [question]: value }));
  };

  const allQuestionsAnswered = Object.values(responses).every(value => value !== '');

  const handleContinue = () => {
    router.push('/cancellation-s0/yes-flow-s2');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
        {/* Top Bar with Title, Back Button, and Step Indicator */}
        <div className="flex justify-between items-center p-4 border-b">
          <button className="text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={() => window.history.back()}>
            &lt; Back
          </button>
          <h2 className="text-xl font-mono text-black ml-auto">Subscription Cancellation</h2>
          <div className="flex items-center space-x-2 ml-2">
            <div className={`h-2 w-8 rounded-3xl ${step === 1 ? 'bg-gray-500' : 'bg-green-500'}`} />
            <div className={`h-2 w-8 rounded-3xl ${step === 2 ? 'bg-gray-300' : step > 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className={`h-2 w-8 rounded-3xl ${step === 3 ? 'bg-gray-300' : step > 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-500 ml-2">Step {step} of 3</span>
          </div>
          <button className="ml-auto text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={() => window.history.back()}>
            ✕
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Left Side - Text and Questions */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-semibold text-gray-700 mb-4">
              Congrats on the new role! 🎉
            </h1>
            <div className="space-y-4">
              <div>
                <p className="text-xl text-gray-600 mb-2">Did you find this job with MigrateMate?*</p>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.foundWithMigrateMate === 'Yes' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('foundWithMigrateMate', 'Yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.foundWithMigrateMate === 'No' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('foundWithMigrateMate', 'No')}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many roles did you <span className="underline">apply</span> for through Migrate Mate?*</p>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '1-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '1-5')}
                  >
                    1-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '6-20' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '6-20')}
                  >
                    6-20
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '20+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '20+')}
                  >
                    20+
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many companies did you <span className="underline">email</span> directly?*</p>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '1-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '1-5')}
                  >
                    1-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '6-20' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '6-20')}
                  >
                    6-20
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '20+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '20+')}
                  >
                    20+
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many different companies did you <span className="underline">interview</span> with?*</p>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '1-2' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '1-2')}
                  >
                    1-2
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '3-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '3-5')}
                  >
                    3-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '5+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '5+')}
                  >
                    5+
                  </button>
                </div>
              </div>
              <button
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                disabled={!allQuestionsAnswered}
                style={{ opacity: !allQuestionsAnswered? 0.5 : 1 }}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-1/3 relative m-10 h-120">
            <Image
              src="/empire-state-compressed.jpg"
              alt="New York City"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden p-4">
          {/* Text and Questions */}
          <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-700 mb-2">
              Congrats on the new role! 🎉
            </h1>
            <div className="space-y-4">
              <div>
                <p className="text-xl text-gray-600 mb-2">Did you find this job with MigrateMate?</p>
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.foundWithMigrateMate === 'Yes' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('foundWithMigrateMate', 'Yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.foundWithMigrateMate === 'No' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('foundWithMigrateMate', 'No')}
                  >
                    No
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many roles did you apply for through Migrate Mate?</p>
                <div className="flex flex-wrap space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '1-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '1-5')}
                  >
                    1-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '6-20' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '6-20')}
                  >
                    6-20
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.rolesApplied === '20+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('rolesApplied', '20+')}
                  >
                    20+
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many companies did you email directly?</p>
                <div className="flex flex-wrap space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '1-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '1-5')}
                  >
                    1-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '6-20' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '6-20')}
                  >
                    6-20
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesEmailed === '20+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesEmailed', '20+')}
                  >
                    20+
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xl text-gray-600 mb-2">How many different companies did you interview with?</p>
                <div className="flex flex-wrap space-x-2">
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '0' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '0')}
                  >
                    0
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '1-2' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '1-2')}
                  >
                    1-2
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '3-5' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '3-5')}
                  >
                    3-5
                  </button>
                  <button
                    className={`flex-1 border border-gray-300 rounded-md py-2 text-sm text-gray-600 font-sans hover:bg-gray-100 ${responses.companiesInterviewed === '5+' ? 'bg-blue-200' : ''}`}
                    onClick={() => handleChange('companiesInterviewed', '5+')}
                  >
                    5+
                  </button>
                </div>
              </div>
              <button
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                disabled={!allQuestionsAnswered}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}