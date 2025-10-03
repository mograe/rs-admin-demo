import React, { createContext, ReactNode, useContext, useState } from 'react';

type PlayerContextValue = {
  currentTitle: string | null;
  setCurrentTitle: (title: string | null) => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  return (
    <PlayerContext.Provider value={{ currentTitle, setCurrentTitle }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
