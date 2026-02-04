import { POST_FIELDS_MAP } from "@src/constants/postFields";

export const getProductFields = (subCategory: string) => {
  return POST_FIELDS_MAP[subCategory] || POST_FIELDS_MAP["other"];
};

export const formatProductDetails = (
  subCategory: string,
  productData: Record<string, any>,
) => {
  const fields = getProductFields(subCategory);
  const formattedDetails: Record<string, string> = {};

  fields.forEach((field) => {
    const value = productData[field.key];
    if (value !== undefined && value !== null && value !== "") {
      formattedDetails[field.key] = String(value);
    }
  });

  return formattedDetails;
};

export interface Product {
  id: string;
  name: string;
  images: string[];
  views: number;
  price: number;
  location: string;
  mainCategory: string;
  subCategory: string;
  description?: string;
  [key: string]: any;
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    trusted: boolean;
  };
  createdAt: string;
}

export const generateMockProduct = (
  id: string,
  mainCategory: string,
  subCategory: string,
): Product => {
  const baseProduct: Product = {
    id,
    name: `Sample ${subCategory}`,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    ],
    views: Math.floor(Math.random() * 1000),
    price: Math.floor(Math.random() * 100000) + 1000,
    location: "Phum Bayab, Sangkat Phnom Penh Thmey, Khan Sen Sok",
    mainCategory,
    subCategory,
    description: `This is a great ${subCategory} in excellent condition.`,
    seller: {
      id: "seller1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      verified: true,
      trusted: true,
    },
    createdAt: new Date().toISOString(),
  };

  const fields = getProductFields(subCategory);

  fields.forEach((field) => {
    if (field.type === "select" && field.options) {
      baseProduct[field.key] = field.options[0];
    } else if (field.type === "number") {
      baseProduct[field.key] = Math.floor(Math.random() * 100);
    } else {
      baseProduct[field.key] = `Sample ${field.label}`;
    }
  });

  return baseProduct;
};
