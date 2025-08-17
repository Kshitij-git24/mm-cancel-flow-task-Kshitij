'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CancellationContext from '@/context/CancellationContext';
import { off } from 'process';

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

    const { responses, setResponses,user, offer } = context;
    console.log(responses);

    //updating subs active
    const updateSubsActive = async () => {
        if (!user?.id) {
            console.error("User ID is not available");
            return;
        }
        const { data, error } = await supabase
            .from("subscriptions")
            .update({
                status: "active",
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
            .eq("status", "pending_cancellation")
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
                accepted_downsell: true,
            })
            .select();

        if (error) {
            console.error("Error creating cancellation record:", error.message);
        } else {
            console.log("Cancellation record created successfully:", data);
        }
    };

    

    const handleLYDR = async() => {
       console.log("done offer accepted")
       const variant = offer.downsell === "true"?"B":"A";
       await createCancellationRecord(variant,"Offer Accepted")
        await updateSubsActive()
       router.push("/");
        
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
                {/* Top Bar with Title, Back Button, and Step Indicator */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-mono text-black ml-auto">Subscription</h2>
                    <button className="ml-auto text-gray-500 hover:text-gray-700 hover:cursor-pointer" onClick={() => router.push("/")}>
                        ✕
                    </button>
                    
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex">
                    {/* Left Side - Text and Text Box */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h1 className="text-xl font-semibold text-gray-700 mb-2">
                            Great choice, mate!
                            <br />
                            <br />
                            You're still on the path to your dream 
                            <br />
                            role. <span className="text-xl font-semibold text-purple-700 mb-2">Let’s make it happen together!</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-4 font-sans">
                            You’ve got XX days left on your current plan.
                            <br/>
                            Starting from XX date, your monthly payment will be $12.50.
                        </p>
                        <p className='text-gray-500 italic'>
                            You can cancel anytime before then.
                        </p>
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleLYDR}
                        >
                            Land your dream role
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
                    <div className="p-4">
                        <h1 className="text-xl font-semibold text-gray-700 mb-2">
                            Great choice, mate!
                            <br />
                            <br />
                            You're still on the path to your dream 
                            <br />
                            role. <span className="text-xl font-semibold text-purple-700 mb-2">Let’s make it happen together!</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-4 font-sans">
                            You’ve got XX days left on your current plan.
                            <br/>
                            Starting from XX date, your monthly payment will be $12.50.
                        </p>
                        <p className='text-gray-500 italic'>
                            You can cancel anytime before then.
                        </p>
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleLYDR}
                        >
                            Land your dream role
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}