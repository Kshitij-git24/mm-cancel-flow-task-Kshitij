'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { useContext, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CancellationContext from '@/context/CancellationContext';

export default function CancellationS0() {
    // const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step] = useState(3);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [visaAnswer, setVisaAnswer] = useState('');
    const [message, setMessage] = useState('');
    const context = useContext(CancellationContext);

    if (!context) {
        throw new Error('CancellationContext is undefined. Ensure the component is wrapped in CancellationProvider.');
    }

    const { responses, setResponses, offer, user} = context;
    console.log(responses);
    console.log("offer ->", offer.downsell)
    console.log("USER -> ",user)

    // const handleContinue = () => {
    //     console.log(selectedOption, visaAnswer, message);
    //     if (selectedOption?.toLowerCase() === "yes") {
    //         router.push("/cancellation-s0/no-visa-help");
    //     } else {
    //         router.push("/cancellation-s0/yes-visa-help");
    //     }
    // };

    const handleBack = () => {
        if (selectedOption) {
            setSelectedOption(null);
            setVisaAnswer('');
            setMessage('');
        } else {
            window.history.back();
        }
    };

    // --- helper to check if Continue should be enabled ---
    const isContinueEnabled = () => {
        if (!selectedOption) return false;

        if (selectedOption === "Too expensive") {
            return visaAnswer.trim().length > 0;
        } else if (
            ["Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].includes(selectedOption)
        ) {
            return message.trim().length >= 25;
        }
        return false;
    };

        const updateSubsCancelled = async () => {
            if (!user?.id) {
                console.error("User ID is not available");
                return;
            }
            const { data, error } = await supabase
                .from("subscriptions")
                .update({
                    status: "cancelled",
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", user.id)
                .select();
    
            if (error) {
                console.error("Error updating subscription status:", error.message);
            } else {
                console.log("Subscription status updated successfully:", data);
            }
        };
    
        //entry for cancelled sub
            const createCancellationRecord = async (downsellVariant:String, reason:String) => {
            if (!user?.id) {
                console.error("User ID is not available");
                return;
            }
    
            const { data: subscriptionData, error: subscriptionError } = await supabase
                .from("subscriptions")
                .select("id")
                .eq("user_id", user.id)
                .eq("status", "cancelled")
                .order("updated_at", { ascending: false })
                .limit(1);
    
            if (subscriptionError) {
                console.error("Error fetching subscription:", subscriptionError.message);
                return;
            }
    
            if (!subscriptionData || subscriptionData.length === 0) {
                console.error("No cancelled subscription found for the user");
                return;
            }
    
            const subscriptionId = subscriptionData[0].id;
    
            const { data, error } = await supabase
                .from("cancellations")
                .insert({
                    user_id: user.id,
                    subscription_id: subscriptionId,
                    downsell_variant: downsellVariant,
                    reason: reason,
                    accepted_downsell: false,
                })
                .select();
    
            if (error) {
                console.error("Error creating cancellation record:", error.message);
            } else {
                console.log("Cancellation record created successfully:", data);
            }
        };
    
        const handleCancellation = async() => {
            console.log("completing cancellation")
            await updateSubsCancelled();
            console.log("done")
            const variant = offer.downsell === "true" ? "B" : "A"
            await createCancellationRecord(variant,"Did not get a job")
            console.log("done 1.0")
            router.push("/cancellation-s0/downsell-final-page")
        };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-4 border-b">
                    <button className="text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={handleBack}>
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
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
                            What’s the main 
                            <br/>
                            reason for cancelling?
                        </h1>
                        <p className="text-l text-gray-600 mb-4 font-sans">
                            Please take a minute to let us know why:
                        </p>

                        {/* Options */}
                        {selectedOption === null && (
                            <div className="space-y-4">
                                {["Too expensive", "Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center space-x-2 text-lg text-gray-700 ${selectedOption === opt ? "font-bold" : ""}`}
                                        onClick={() => setSelectedOption(opt)}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 border-gray-400 ${selectedOption === opt ? 'bg-black' : 'bg-white'}`}></div>
                                        <span>{opt}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Too expensive follow-up */}
                        {selectedOption === "Too expensive" && (
                            <div className="space-y-4">
                                <button className="flex items-center space-x-2 text-lg text-gray-700 font-bold">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-black"></div>
                                    <span>Too expensive</span>
                                </button>
                                <div className="mt-4">
                                    <p className="text-lg text-gray-600 mb-2">What would be the maximum you would be willing to pay?*</p>
                                    <textarea
                                        className="w-full h-10 p-2 border border-gray-300 rounded-md text-sm text-gray-600 font-sans resize-none"
                                        value={visaAnswer}
                                        onChange={(e) => setVisaAnswer(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 25-char textarea for the other 4 options */}
                        {["Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].includes(selectedOption || "") && (
                            <div className="space-y-4">
                                <button className="flex items-center space-x-2 text-lg text-gray-700 font-bold">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-black"></div>
                                    <span>{selectedOption}</span>
                                </button>
                                {selectedOption === "Platform not helpful" ? (
                                        <p className="text-lg text-gray-600 mb-2">
                                            What can we change to make the platform more helpful?*
                                        </p>
                                    ) : selectedOption === "Not enough relevant jobs" ? (
                                        <p className="text-lg text-gray-600 mb-2">
                                            In which way can we make the jobs more relevant?*
                                        </p>
                                    ) : selectedOption === "Decided not to move" ? (
                                        <p className="text-lg text-gray-600 mb-2">
                                            What changed for you to decide to not move?*
                                        </p>
                                    ) : selectedOption === "Other" ? (
                                        <p className="text-lg text-gray-600 mb-2">
                                            What would have helped you the most?*
                                        </p>
                                    ) : null}
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
                            </div>
                        )}
                        
                        {
                offer.downsell ==="true" && (
                    <button className="w-full mt-4 bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600"
                onClick={()=>{
                router.push("/cancellation-s0/downsell-accepted-page")
              }}
                >
                  Get 50% off | $12.50<span className="line-through text-gray-400 ml-2 text-lg">$25</span>
                </button>
                )
              }
                        {/* Continue button */}
                        <button
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                            disabled={!isContinueEnabled()}
                            style={{ opacity: !isContinueEnabled() ? 0.5 : 1 }}
                            onClick={handleCancellation}
                        >
                            Complete Cancellation
                        </button>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-1/3 relative m-10 h-60">
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
                    <div className="p-4 flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
                            What’s the main 
                            <br/>
                            reason for cancelling?
                        </h1>
                        <p className="text-base text-gray-600 mb-4 font-sans">
                            Please take a minute to let us know why:
                        </p>

                        {/* Options */}
                        {selectedOption === null && (
                            <div className="space-y-3">
                                {["Too expensive", "Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].map(opt => (
                                    <button
                                        key={opt}
                                        className={`flex items-center space-x-2 text-base text-gray-700 ${selectedOption === opt ? "font-bold" : ""}`}
                                        onClick={() => setSelectedOption(opt)}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 border-gray-400 ${selectedOption === opt ? 'bg-black' : 'bg-white'}`}></div>
                                        <span>{opt}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Too expensive follow-up */}
                        {selectedOption === "Too expensive" && (
                            <div className="space-y-3">
                                <button className="flex items-center space-x-2 text-base text-gray-700 font-bold">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 bg-black"></div>
                                    <span>Too expensive</span>
                                </button>
                                <div className="mt-3">
                                    <p className="text-base text-gray-600 mb-2">What would be the maximum you would be willing to pay?*</p>
                                    <textarea
                                        className="w-full h-10 p-2 border border-gray-300 rounded-md text-sm text-gray-600 font-sans resize-none"
                                        value={visaAnswer}
                                        onChange={(e) => setVisaAnswer(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 25-char textarea for the other 4 options */}
                        {["Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].includes(selectedOption || "") && (
                            <div className="space-y-3">
                                <button className="flex items-center space-x-2 text-base text-gray-700 font-bold">
                                    <div className="w-4 h-4 rounded-full border-2 border-gray-400 bg-black"></div>
                                    <span>{selectedOption}</span>
                                </button>
                                {selectedOption === "Platform not helpful" ? (
                                        <p className="text-base text-gray-600 mb-2">
                                            What can we change to make the platform more helpful?*
                                        </p>
                                    ) : selectedOption === "Not enough relevant jobs" ? (
                                        <p className="text-base text-gray-600 mb-2">
                                            In which way can we make the jobs more relevant?*
                                        </p>
                                    ) : selectedOption === "Decided not to move" ? (
                                        <p className="text-base text-gray-600 mb-2">
                                            What changed for you to decide to not move?*
                                        </p>
                                    ) : selectedOption === "Other" ? (
                                        <p className="text-base text-gray-600 mb-2">
                                            What would have helped you the most?*
                                        </p>
                                    ) : null}
                                <div className="relative">
                                    <textarea
                                        className="w-full h-32 mt-3 p-2 border border-gray-300 rounded-md text-sm text-gray-600 font-sans resize-none"
                                        placeholder="Enter your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                                        Min 25 characters ({Math.min(message.trim().length, 25)}/25)
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                offer.downsell ==="true" && (
                    <button className="w-full mt-4 bg-green-500 text-white rounded-md py-2 font-medium hover:bg-green-600"
                onClick={()=>{
                router.push("/cancellation-s0/downsell-accepted-page")
              }}
                >
                  Get 50% off | $12.50<span className="line-through text-gray-400 ml-2 text-lg">$25</span>
                </button>
                )
              }
                        {/* Continue button */}
                        <button
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans mt-4 hover:bg-gray-100"
                            disabled={!isContinueEnabled()}
                            style={{ opacity: !isContinueEnabled() ? 0.5 : 1 }}
                            onClick={handleCancellation}
                        >
                            Complete Cancellation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}