"use client"
import { stat } from 'fs';
import { useSession } from 'next-auth/react';
import { useContext, useState, useEffect, createContext, use } from 'react';
import { set } from 'zod';

const UserContext = createContext<{
    followers: any[],
    setFollowers: (followers: any[]) => void,
    following: any[],
    setFollowing: (following: any[]) => void,
    groups: any[],
    setGroups: (groups: any[]) => void,
}>({
    followers: [],
    setFollowers: () => { },
    following: [],
    setFollowing: () => { },
    groups: [],
    setGroups: () => { },
});

export const UserDataProvider = ({ children }: any) => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.id) return
        getUserGroups()
    }, [status])


    function getUserGroups() {
        if (session?.user?.id === undefined) return
        fetch(`/api/groups/${session?.user?.id}`)
        .then(res => res.json())
        .then(data => {
            setGroups(data)
        })
    }
    
    const value = {
        followers,
        setFollowers,
        following,
        setFollowing,
        groups,
        setGroups,
    };

    return (
        <UserContext.Provider value={ value }>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => useContext(UserContext);