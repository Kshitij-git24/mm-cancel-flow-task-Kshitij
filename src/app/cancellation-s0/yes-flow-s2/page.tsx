'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CancellationContext from '@/context/CancellationContext';

export default function CancellationS0() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step] = useState(2);
    const [message, setMessage] = useState('');
    const context = useContext(CancellationContext);

    if (!context) {
        throw new Error('CancellationContext is undefined. Ensure the component is wrapped in CancellationProvider.');
    }

    const { responses, setResponses } = context;
    console.log(responses);

    const handleContinue = () => {
    if (responses.foundWithMigrateMate.toLowerCase() === "yes") {
        router.push("/cancellation-s0/yes-flow-s3");
    } else {
        router.push("/cancellation-s0/no-flow-s3");
    }
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
                        <div className={`h-2 w-8 rounded-3xl ${step === 2 ? 'bg-gray-500' : step > 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className={`h-2 w-8 rounded-3xl ${step === 3 ? 'bg-gray-500' : step > 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-500 ml-2">Step {step} of 3</span>
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
                            What's one thing you wish we
                            <br />
                            could've helped you with?
                        </h1>
                        <p className="text-xl text-gray-600 mb-auto font-sans">
                            We're always looking to improve, your thoughts can help us
                            <br />
                            make Migrate Mate more useful for others.*
                        </p>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 mt-4 p-2 border border-gray-300 rounded-md text-sm text-gray-600 font-sans resize-none"
                                placeholder="Enter your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                                Min 25 characters ({Math.min(message.trim().length, 25)}/25)
                            </div>
                        </div>
                        <button
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                            disabled={message.trim().length < 25}
                            style={{ opacity: message.trim().length < 25 ? 0.5 : 1 }}
                            onClick={handleContinue}
                        >
                            Continue
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
                    {/* Text and Text Box */}
                    <div className="p-4">
                        <h1 className="text-xl font-semibold text-gray-700 mb-2">
                            What's one thing you wish we
                            <br />
                            could've helped you with?
                        </h1>
                        <p className="text-lg text-gray-600 mb-2 font-sans">
                            We're always looking to improve, your thoughts can help us
                            <br />
                            make Migrate Mate more useful for others.*
                        </p>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 mt-2 p-2 border border-gray-800 rounded-md text-sm text-gray-600 font-sans resize-none"
                                placeholder="Enter your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                                Min 25 characters ({Math.min(message.trim().length, 25)}/25))
                            </div>
                        </div>
                        <button
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                            disabled={message.trim().length < 25}
                            style={{ opacity: message.trim().length < 25 ? 0.5 : 1 }}
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}