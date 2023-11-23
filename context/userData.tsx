"use client"
import { useSession } from 'next-auth/react';
import { useContext, useState, useEffect, createContext, use } from 'react';

const UserContext = createContext<{
    followers: any[],
    setFollowers: (followers: any[]) => void,
    following: any[],
    setFollowing: (following: any[]) => void,
    groups: any[],
    setGroups: (groups: any[]) => void,
    addNewGroup: (newGroup: any) => void,
    removeGroup: (groupId: string) => void,
    updateGroup: (groupId: string, updatedGroup: any) => void,
    avatar: string,
    setAvatar: (avatar: string) => void,
}>({
    followers: [],
    setFollowers: () => { },
    following: [],
    setFollowing: () => { },
    groups: [],
    setGroups: () => { },
    addNewGroup: () => { },
    removeGroup: () => { },
    updateGroup: () => { },
    avatar: "",
    setAvatar: () => { }
});

export const UserDataProvider = ({ children }: any) => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
   

    const { data: session, status } = useSession();
    const [avatar, setAvatar] = useState<string>(session?.user?.image);

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

    function addNewGroup(newGroup: any) {
        setGroups([...groups, newGroup])
    }

    function removeGroup(groupId: string) {
        setGroups(groups.filter(group => group.id !== groupId))
    }

    function updateGroup(groupId: string, updatedGroup: any) {
        setGroups(groups.map(group => {
            if (group.id === groupId) {
                return updatedGroup
            } else {
                return group
            }
        }))
    }
    
    const value = {
        followers,
        setFollowers,
        following,
        setFollowing,
        groups,
        setGroups,
        addNewGroup,
        removeGroup,
        updateGroup,
        avatar: avatar,
        setAvatar: setAvatar
    };

    return (
        <UserContext.Provider value={ value }>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => useContext(UserContext);