import React, { createContext, ReactNode, useContext, useState } from "react";

export interface TradeDraft {
  photos: string[];
  province: string | null;
  district: string | null;
  commune: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface TradeDraftContextType {
  draft: TradeDraft;
  updateDraft: (key: keyof TradeDraft, value: any) => void;
  resetDraft: () => void;
}

const defaultDraft: TradeDraft = {
  photos: [],
  province: null,
  district: null,
  commune: null,
  location: {
    latitude: 11.5564,
    longitude: 104.9282,
  },
};

const TradeDraftContext = createContext<TradeDraftContextType | undefined>(
  undefined,
);

export function TradeDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<TradeDraft>(defaultDraft);

  const updateDraft = (key: keyof TradeDraft, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetDraft = () => {
    setDraft(defaultDraft);
  };

  return (
    <TradeDraftContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </TradeDraftContext.Provider>
  );
}

export function useTradeDraft() {
  const context = useContext(TradeDraftContext);
  if (!context) {
    throw new Error("useTradeDraft must be used within TradeDraftProvider");
  }
  return context;
}

export default TradeDraftProvider;
