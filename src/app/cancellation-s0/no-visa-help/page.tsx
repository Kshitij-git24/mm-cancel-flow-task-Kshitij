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

    const { responses, setResponses,user } = context;
    console.log(responses);

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

    const handleFinish = async() => {
        console.log("finished with no visa help")
        await updateSubsCancelled();
        console.log("done")
        await createCancellationRecord("A","Got a job")
        console.log("done 1.0")
        router.push("/")
    };

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
                            All done, your cancellation's
                            <br />
                            been processed.
                        </h1>
                        <p className="text-xl text-gray-600 mb-4 font-sans">
                            We’re stoked to hear you’ve landed a job and sorted your visa. 
                            <br />
                            Big congrats from the team. 🙌
                        </p>
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleFinish}
                        >
                            Finish
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
                            All done, your cancellation's
                            <br />
                            been processed.
                        </h1>
                        <p className="text-lg text-gray-600 mb-4 font-sans">
                            We’re stoked to hear you’ve landed a job and sorted your visa. 
                            <br />
                            Big congrats from the team. 🙌
                        </p>
                        
                        <button
                            className="w-full rounded-md px-4 py-2 text-sm font-sans mt-4 bg-purple-600 text-white hover:bg-purple-700"
                            onClick={handleFinish}
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}