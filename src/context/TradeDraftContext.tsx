import { createContext, useContext, useState } from "react";

const initialTradeDraft = {
  photos: [] as string[],
  title: "",
  description: "",
  condition: "",
  originalPrice: "", // Stored as string, parsed to float later if needed
  lookingFor: [] as { name: string; description: string }[],
  province: "",
  location: { latitude: 11.5564, longitude: 104.9282 }, // Default to Phnom Penh center
  district: "",
  commune: "",
  phoneNumber: "",
};

export type TradeDraft = typeof initialTradeDraft;

type TradeDraftContextType = {
  draft: TradeDraft;
  updateDraft: (key: keyof TradeDraft, value: any) => void;
  resetDraft: () => void;
};

export const TradeDraftContext = createContext<TradeDraftContextType | undefined>(
  undefined,
);

export default function TradeDraftProvider({ children }: any) {
  const [draft, setDraft] = useState<TradeDraft>(initialTradeDraft);

  const updateDraft = (key: keyof TradeDraft, value: any) =>
    setDraft((p) => ({ ...p, [key]: value }));

  const resetDraft = () => setDraft(initialTradeDraft);

  return (
    <TradeDraftContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </TradeDraftContext.Provider>
  );
}

export const useTradeDraft = () => {
  const context = useContext(TradeDraftContext);
  if (!context)
    throw new Error("useTradeDraft must be used within TradeDraftProvider");
  return context;
};
