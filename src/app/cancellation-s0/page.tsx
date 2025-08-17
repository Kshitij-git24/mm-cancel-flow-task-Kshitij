'use client';

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CancellationContext from '@/context/CancellationContext';

export default function CancellationS0() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const context = useContext(CancellationContext);

    // Type guard to ensure context is defined
    if (!context) {
        console.error('CancellationContext is not provided. Ensure CancellationProvider wraps the component.');
        return null; // Or handle this case appropriately (e.g., render a loading state)
    }

    const { setUser: setContextUser,offer } = context;
    console.log("Offer", offer.downsell)

    useEffect(() => {
        const loginAndFetchUser = async () => {
            // Step 1: Login
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: "testuser@example.com",
                password: "NewStrongPassword123!",
            });

            if (loginError) {
                console.error("Login error:", loginError.message);
                return;
            }

            console.log("Logged in:", loginData);

            // Step 2: Fetch user
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error.message);
                return;
            }

            if (!data?.user) {
                console.error("No authenticated user");
                return;
            }

            console.log("Fetched user:", data.user);
            setContextUser({ id: data.user.id, email: data.user.email||null, is_auth: true }); // Set user in context
            setUser(data.user); // Update local state if needed
        };

        loginAndFetchUser();
    }, []);

    const updateSubsPending = async () => {
        if (!user?.id) {
            console.error("User ID is not available");
            return;
        }
        const { data, error } = await supabase
            .from("subscriptions")
            .update({
                status: "pending_cancellation",
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

    const handleYes = async () => {
        console.log(user);
        await updateSubsPending();
        router.push("/cancellation-s0/yes-flow-s1");
    };

    const handleNo = async () => {
        console.log("Clicked No");
        await updateSubsPending();
        router.push("/cancellation-s0/downsell-flow-s1");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl h-auto overflow-hidden">
                {/* Top Bar with Title and Close Button */}
                <div className="flex justify-center items-center p-4 border-b">
                    <h2 className="text-xl font-mono text-black ml-auto">Subscription Cancellation</h2>
                    <button
                        className="ml-auto text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                        onClick={() => window.history.back()}
                    >
                        ✕
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex">
                    {/* Left Side - Text */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <h1 className="text-4xl font-semibold text-gray-700 mb-4">
                            Hey mate,
                            <br />
                            Quick one before you go.
                        </h1>
                        <p className="text-4xl italic font-semibold mt-2 text-gray-700 mb-auto">
                            Have you found a job yet?
                        </p>
                        <p className="text-xl text-gray-600 mb-auto font-sans">
                            Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we
                            can do better.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <button
                                onClick={handleYes}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-xl text-gray-600 font-sans hover:bg-gray-100 hover:cursor-pointer"
                            >
                                Yes, I’ve found a job
                            </button>
                            <button
                                onClick={handleNo}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-xl text-gray-600 font-sans hover:bg-gray-100 hover:cursor-pointer"
                            >
                                Not yet – I’m still looking
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-1/3 relative m-10 h-90">
                        <Image src="/empire-state-compressed.jpg" alt="New York City" fill className="object-cover rounded-2xl" />
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex flex-col md:hidden p-4">
                    {/* Image on Top */}
                    <div className="w-full relative mb-4 h-48">
                        <Image src="/empire-state-compressed.jpg" alt="New York City" fill className="object-cover rounded-2xl" />
                    </div>
                    {/* Text and Buttons */}
                    <div className="p-4">
                        <h1 className="text-xl font-semibold text-gray-700 mb-2">
                            Hey mate,
                            <br />
                            Quick one before you go.
                        </h1>
                        <p className="text-lg italic font-semibold text-gray-700 mb-2">
                            Have you found a job yet?
                        </p>
                        <p className="text-sm text-gray-600 mb-4 font-sans">
                            Whatever your answer, we just want to help you take the next step. With visa support, or by hearing how we
                            can do better.
                        </p>
                        <div className="flex flex-col gap-2">
                            <button className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans hover:bg-gray-100"
                            onClick={handleYes}>
                                Yes, I’ve found a job
                            </button>
                            <button className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 font-sans hover:bg-gray-100"
                            onClick={handleNo}>
                                Not yet – I’m still looking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}