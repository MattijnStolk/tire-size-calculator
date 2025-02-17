'use client'

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

//function to get the next break time
const getNextBreakTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Set break times (for example, breaks happen at 10:00 AM, 12:00 PM, 3:00 PM)
    const breakTimes = [
        { hour: 10, minute: 0 },
        { hour: 12, minute: 30 },
        { hour: 15, minute: 0 },
    ];

    // Find the next break after the current time
    let nextBreak = breakTimes.find(
        (time) => time.hour > currentHour || (time.hour === currentHour && time.minute > currentMinute)
    );

    // If no break time is found, set to the first break of the next day
    if (!nextBreak) {
        nextBreak = breakTimes[0];
    }

    return nextBreak;
};

// Function to calculate the time left in minutes
const getTimeLeft = (nextBreak: { hour: number; minute: number }) => {
    const currentTime = new Date();
    const breakTime = new Date(currentTime.setHours(nextBreak.hour, nextBreak.minute, 0, 0));
    const timeDiff = breakTime.getTime() - Date.now();

    const hoursLeft = Math.floor(timeDiff / 1000 / 60 / 60);
    const minutesLeft = Math.floor((timeDiff / 1000 / 60) % 60);

    let timeString = '';

    if (hoursLeft > 0) {
        timeString += `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
    }
    if (minutesLeft > 0) {
        if (hoursLeft > 0) {
            timeString += ' and ';
        }
        timeString += `${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
    }

    return timeString || 'Koffie tijd!!';
};


export default function Page() {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [nextBreak, setNextBreak] = useState<{ hour: number; minute: number } | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            const nextBreakTime = getNextBreakTime();
            setNextBreak(nextBreakTime);
            setTimeLeft(getTimeLeft(nextBreakTime));
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup the interval on unmount
    }, []);

    return (
        <Suspense fallback={<>Loading..</>}>
            <div className="p-10 flex flex-col items-center justify-center w-full">
                <div className="flex flex-row gap-5 justify-center">
                    <h1 className="text-xl">Tijd: {currentTime}</h1>
                    {nextBreak && (
                        <h2 className="text-xl">Volgende pauze: {`${nextBreak.hour}:${nextBreak.minute < 10 ? '0' : ''}${nextBreak.minute}`}</h2>
                    )}
                </div>

                {nextBreak && (
                    <div className="mt-5">
                        <p>Tijd tot de volgende pauze: </p>
                        <p className="text-center text-4xl">{timeLeft}</p>
                    </div>
                )}

                <div className="text-2xl hover:pointer hover:text-blue-800 transition-all mt-5">
                    <Link href={'/'}>Terug naar de berekenaar</Link>
                </div>
            </div>
        </Suspense>
    );
}