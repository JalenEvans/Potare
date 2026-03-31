import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type ProfileContextType = {
  username: string;
  joinedDate: string;
  bio: string;
  profileImage: string | null;
  setUsername: (value: string) => void;
  setJoinedDate: (value: string) => void;
  setBio: (value: string) => void;
  setProfileImage: (value: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('Username');
  const [joinedDate, setJoinedDate] = useState('March 2026');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      username,
      joinedDate,
      bio,
      profileImage,
      setUsername,
      setJoinedDate,
      setBio,
      setProfileImage,
    }),
    [username, joinedDate, bio, profileImage]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
}