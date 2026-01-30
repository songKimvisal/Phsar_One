import { createContext, useContext, useState } from "react";

const initialDraft = {
  categoryId: "",
  subCategory: "",
  photos: [] as string[],
  title: "",
  price: "",
  currency: "USD",
  discountType: "none", // New field for discount type
  discountValue: "", // New field for discount value
  negotiable: false, // Reintroduce negotiable field
  description: "",
  details: {} as Record<string, any>,
  province: "",
  location: { latitude: 11.5564, longitude: 104.9282 },
  district: "",
  commune: "",
  contact: { chatOnly: true, sellerName: "", phones: [""] as string[], email: "" }, // Modified contact with sellerName, phones array, and email
};

type SellDraftContextType = {
  draft: typeof initialDraft;
  updateDraft: (key: string, value: any) => void;
  updateDetail: (key: string, value: any) => void;
  resetDraft: () => void;
};

export const SellDraftContext = createContext<SellDraftContextType | undefined>(
  undefined,
);

export default function SellDraftProvider({ children }: any) {
  const [draft, setDraft] = useState(initialDraft);
  const updateDraft = (key: string, value: any) =>
    setDraft((p) => ({ ...p, [key]: value }));
  const updateDetail = (key: string, value: any) => {
    setDraft((p) => ({ ...p, details: { ...p.details, [key]: value } }));
  };
  const resetDraft = () => setDraft(initialDraft);

  return (
    <SellDraftContext.Provider
      value={{ draft, updateDraft, updateDetail, resetDraft }}
    >
      {children}
    </SellDraftContext.Provider>
  );
}

export const useSellDraft = () => {
  const context = useContext(SellDraftContext);
  if (!context)
    throw new Error("useSellDraft must be used within SellDraftProvider");
  return context;
};
