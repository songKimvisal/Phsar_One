import { TradeProduct } from "@src/types/productTypes";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface TradeProductsContextType {
  products: TradeProduct[];
  addProduct: (product: TradeProduct) => void;
  getProductById: (id: string) => TradeProduct | undefined;
}

const DUMMY_TRADE_PRODUCTS: TradeProduct[] = [
  {
    id: "1",
    images: [
      "https://imgs.search.brave.com/07oXKYCqhykLHDwPsPykawJShCdtRurhPlY_xoxthXs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/ODM4NjI1Mi9waG90/by9hcHBsZS1tYWNi/b29rLXByby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9QlZS/WTNjSWN6VEExUVJQ/YUxmcXlYd3lFUjha/R1AyVE81QjR1OV9S/c3lLWT0",
    ],
    title: "MacBook Pro M1",
    seller: "Sarah Chen",
    timeAgo: { value: 2, unit: "hours" },
    lookingFor: [
      {
        name: "Gaming Laptop ROG Zephyrus",
        description:
          "Preferably with RTX 3060 or higher GPU, 16GB+ RAM, good cooling system",
      },
    ],
    condition: "good",
    originalPrice: 1299,
    province: "phnomPenh",
    district: "Sen Sok",
    commune: "Phnom Penh Thmey",
    coordinates: {
      latitude: 11.5676,
      longitude: 104.8908,
    },
    description:
      "MacBook Pro 2020, 16GB RAM, 512GB SSD. Perfect condition, always used with case.",
    telephone: "012#### / 010####",
    estimatedTradeValueRange: "$1,200 - $1,500",
    owner: {
      name: "Sarah Chen",
      isVerified: true,
      avatar:
        "https://imgs.search.brave.com/07oXKYCqhykLHDwPsPykawJShCdtRurhPlY_xoxthXs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/ODM4NjI1Mi9waG90/by9hcHBsZS1tYWNi/b29rLXByby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9QlZS/WTNjSWN6VEExUVJQ/YUxmcXlYd3lFUjha/R1AyVE81QjR1OV9S/c3lLWT0",
    },
    postedDate: "2024-02-09T10:00:00Z",
  },
  {
    id: "2",
    images: [
      "https://imgs.search.brave.com/07oXKYCqhykLHDwPsPykawJShCdtRurhPlY_xoxthXs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/ODM4NjI1Mi9waG90/by9hcHBsZS1tYWNi/b29rLXByby5qcGc_/cz=612x612&w=0&k=20&c=BVRY3cIczTA1QRPAhflqyXwyES8ZGP2TO5B4u9_RsyKY=",
    ],
    title: "Steam Deck",
    seller: "By Lina",
    timeAgo: { value: 2, unit: "hours" },
    lookingFor: [{ name: "Handheld Gaming Device" }],
    condition: "good",
    originalPrice: 399,
    province: "phnomPenh",
    district: "Mean Chey",
    commune: "Chak Angre Leu",
    coordinates: {
      latitude: 11.5204,
      longitude: 104.9189,
    },
    description:
      "Steam Deck 512GB, great condition, comes with case and charger.",
    telephone: "015#### / 077####",
    estimatedTradeValueRange: "$350 - $450",
    owner: {
      name: "Lina",
      isVerified: false,
      avatar:
        "https://imgs.search.brave.com/07oXKYCqhykLHDwPsPykawJShCdtRurhPlY_xoxthXs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/ODM4NjI1Mi9waG90/by9hcHBsZS1tYWNi/b29rLXByby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9QlZS/WTNjSWN6VEExUVJQ/YUxmcXlYd3lFUjha/R1AyVE81QjR1OV9S//c3lLWT0",
    },
    postedDate: "2024-02-10T14:30:00Z",
  },
];

const TradeProductsContext = createContext<
  TradeProductsContextType | undefined
>(undefined);

export function TradeProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] =
    useState<TradeProduct[]>(DUMMY_TRADE_PRODUCTS);

  const addProduct = (product: TradeProduct) => {
    setProducts((prev) => [product, ...prev]);
  };

  const getProductById = (id: string): TradeProduct | undefined => {
    return products.find((p) => p.id === id);
  };

  return (
    <TradeProductsContext.Provider
      value={{ products, addProduct, getProductById }}
    >
      {children}
    </TradeProductsContext.Provider>
  );
}

export function useTradeProducts() {
  const context = useContext(TradeProductsContext);
  if (!context) {
    throw new Error(
      "useTradeProducts must be used within TradeProductsProvider",
    );
  }
  return context;
}

export default TradeProductsProvider;
