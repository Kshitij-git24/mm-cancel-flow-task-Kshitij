'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import CancellationContext from '@/context/CancellationContext';

export default function CancellationS0() {
  const [step] = useState(1);
  const [showOffer, setShowOffer] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(CancellationContext);

  if (!context) {
    throw new Error('CancellationContext is undefined. Ensure the component is wrapped in CancellationProvider.');
  }

  const { responses, offer, setOffer } = context;

  useEffect(() => {
    // Randomly assign 50% of users to see the offer
    console.log(offer.downsell)
    if (offer.downsell === null){
        const flag = Math.random() < 0.5;
        setShowOffer(flag);
        if (flag === true){
            setOffer({downsell:"true"});
        }
        else{
            setOffer({downsell:"false"});
        }
        
    }
    else{
        if (offer.downsell=="true"){
            setShowOffer(true)
        }
        else{
            setShowOffer(false)
        }
    }
  }, []);

  const noThanks = () => {
    router.push("/cancellation-s0/downsell-flow-s2")
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b">
          <button
            className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            onClick={() => window.history.back()}
          >
            &lt; Back
          </button>
          <h2 className="text-xl font-mono text-black ml-auto">Subscription Cancellation</h2>
          <div className="flex items-center space-x-2 ml-2">
            <div className={`h-2 w-8 rounded-3xl ${step === 1 ? 'bg-gray-500' : 'bg-green-500'}`} />
            <div className={`h-2 w-8 rounded-3xl ${step === 2 ? 'bg-gray-500' : step > 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <div className={`h-2 w-8 rounded-3xl ${step === 3 ? 'bg-gray-500' : step > 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-500 ml-2">Step {step} of 3</span>
          </div>
          <button
            className="ml-auto text-gray-500 hover:text-gray-700 hover:cursor-pointer"
            onClick={() => window.history.back()}
          >
            ✕
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Left Side */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-semibold text-gray-700 mb-4">
              We built this to help you land the
              <br />
              job, this makes it a little easier.
            </h1>
            <p className="text-xl text-gray-600 mb-6 font-sans">
              We’ve been there and we’re here to help you.
            </p>

            {/* Offer Box (only 50% of users) */}
            {showOffer && (
              <div className="border border-purple-300 bg-purple-50 rounded-xl p-6 mb-4 text-center">
                <p className="text-lg font-medium text-gray-800 mb-2">
                  Here’s <span className="font-bold">50% off</span> until you find a job.
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  $12.50<span className="text-base">/month</span>
                  <span className="line-through text-gray-400 ml-2 text-lg">$25/month</span>
                </p>
                <button className="w-full mt-4 bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600"
                onClick={()=>{
                router.push("/cancellation-s0/downsell-accepted-page")
              }}
                >
                  Get 50% off
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  You won’t be charged until your next billing date.
                </p>
              </div>
            )}

            <button
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans hover:bg-gray-100"
              onClick={noThanks}
            >
              No thanks
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="w-1/3 relative m-10 h-90">
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
          <h1 className="text-xl font-semibold text-gray-700 mb-2">
            We built this to help you land the
            <br />
            job, this makes it a little easier.
          </h1>
          <p className="text-lg text-gray-600 mb-4 font-sans">
            We’ve been there and we’re here to help you.
          </p>

          {/* Offer (only for 50% of users) */}
          {showOffer && (
            <div className="border border-purple-300 bg-purple-50 rounded-xl p-4 mb-4 text-center">
              <p className="text-base font-medium text-gray-800 mb-1">
                Here’s <span className="font-bold">50% off</span> until you find a job.
              </p>
              <p className="text-xl font-bold text-purple-600">
                $12.50<span className="text-sm">/month</span>
                <span className="line-through text-gray-400 ml-2 text-sm">$25/month</span>
              </p>
              <button className="w-full mt-3 bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600"
              onClick={()=>{
                router.push("/cancellation-s0/downsell-accepted-page")
              }}>
                Get 50% off
              </button>
              <p className="text-xs text-gray-500 mt-2">
                You won’t be charged until your next billing date.
              </p>
            </div>
          )}

          <button
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans hover:bg-gray-100"
            onClick={noThanks}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
