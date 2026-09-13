"use client";

import React, { createContext, useContext, useState } from "react";

export interface TrialItem {
  id: string;
  name: { en: string; bn: string };
  category: "saree" | "jewelry" | "clutch" | "shawl";
  image: string;
  overlayImage?: string;
  price: { en: string; bn: string };
  defaultScale?: number;
  defaultPosition?: { x: number; y: number };
}

interface StudioContextType {
  isStudioOpen: boolean;
  activeItem: TrialItem | null;
  openStudio: (item?: TrialItem) => void;
  closeStudio: () => void;
  setActiveItem: (item: TrialItem | null) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<TrialItem | null>(null);

  const openStudio = (item?: TrialItem) => {
    if (item) setActiveItem(item);
    setIsStudioOpen(true);
  };

  const closeStudio = () => {
    setIsStudioOpen(false);
  };

  return (
    <StudioContext.Provider
      value={{
        isStudioOpen,
        activeItem,
        openStudio,
        closeStudio,
        setActiveItem,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
