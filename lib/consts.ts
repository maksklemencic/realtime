import { BadgePlus, MailPlus } from "lucide-react";

export const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
]

export function formatTime(date: string) {
    const options = { hour: '2-digit', minute: '2-digit' } as const;
    return new Date(date).toLocaleTimeString('de-DE', options);
}


export function formatDate(date: string) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    return new Date(date).toLocaleDateString('de-DE', options);
}

export function formatDateAndTime(date: string) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
    return new Date(date).toLocaleDateString('de-DE', options);
}

export function formatDateTimeChat(date: string) {
    const daysEnglish = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } as const;
    const dateObj = new Date(date);
    const currentDate = new Date();
    const diffInDays = Math.floor((currentDate.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
        const day = daysEnglish[dateObj.getDay()];
        return `${day}, ${dateObj.toLocaleTimeString('de-DE', options)}`;
    } else if (diffInDays < 365) {
        return `${dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} ${dateObj.toLocaleTimeString('en-US', options)}`;
    } else {
        return `${dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    }
}
