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


export function formatDate(date: string) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
    return new Date(date).toLocaleDateString('de-DE', options);
}

export function formatDateAndTime(date: string) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
    return new Date(date).toLocaleDateString('de-DE', options);
}
