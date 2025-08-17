'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CancellationContext from '@/context/CancellationContext';

export default function CancellationS0() {
    // const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step] = useState(4);
    const [message, setMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [visaAnswer, setVisaAnswer] = useState('');
    const context = useContext(CancellationContext);

    if (!context) {
        throw new Error('CancellationContext is undefined. Ensure the component is wrapped in CancellationProvider.');
    }

    const handleBTJ = () =>{
        router.push("/");
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
                {/* Top Bar with Title, Back Button, and Step Indicator */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-mono text-black ml-auto">Subscription Cancelled</h2>
                    <div className="flex items-center space-x-2 ml-2">
                        <div className={`h-2 w-8 rounded-3xl ${step === 1 ? 'bg-gray-500' : 'bg-green-500'}`} />
                        <div className={`h-2 w-8 rounded-3xl ${step === 2 ? 'bg-gray-500' : step > 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className={`h-2 w-8 rounded-3xl ${step === 3 ? 'bg-gray-500' : step > 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-500 ml-2">Completed</span>
                    </div>
                    <button className="ml-auto text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={() => window.history.back()}>
                        ✕
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex">
                    {/* Left Side - Text and Text Box */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
                            Sorry to see you go, mate.
                        </h1>
                        <p className="text-3xl text-gray-600 mb-4 mt-3 font-semibold">
                            Thanks for being with us, and you’re 
                            <br/>
                            always welcome back.
                        </p>
                        <p className="text-l text-gray-500 mb-4 font-semibold">
                            Your subscription is set to end on XX date.
                            <br/>
                            You’ll still have full access until then. No further charges after that.
                        </p>
                        <p className="text-s text-gray-500 mb-4 font-sans">
                            Changed your mind? You can reactivate anytime before your end date.
                        </p>
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleBTJ}
                        >
                            Back to Jobs
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-1/3 relative m-10 h-80">
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
                    {/* Image on Top */}
                    <div className="relative w-full h-40 mb-4">
                        <Image
                            src="/empire-state-compressed.jpg"
                            alt="New York City"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>

                    {/* Text and Text Box */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
                            Sorry to see you go, mate.
                        </h1>
                        <p className="text-3xl text-gray-600 mb-4 mt-3 font-semibold">
                            Thanks for being with us, and you’re 
                            <br/>
                            always welcome back.
                        </p>
                        <p className="text-l text-gray-500 mb-4 font-semibold">
                            Your subscription is set to end on XX date.
                            <br/>
                            You’ll still have full access until then. No further charges after that.
                        </p>
                        <p className="text-s text-gray-500 mb-4 font-sans">
                            Changed your mind? You can reactivate anytime before your end date.
                        </p>
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleBTJ}
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}