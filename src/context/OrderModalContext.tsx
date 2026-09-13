"use client";

import React, { createContext, useContext, useState } from "react";

export interface QuickOrderProduct {
  id: string;
  name: string;
  weave?: string;
  color?: string;
  price: string;
  image: string;
  numericPrice?: number;
}

interface OrderModalContextType {
  isOpen: boolean;
  product: QuickOrderProduct | null;
  openOrderModal: (product: QuickOrderProduct) => void;
  closeOrderModal: () => void;
}

const OrderModalContext = createContext<OrderModalContextType | undefined>(undefined);

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<QuickOrderProduct | null>(null);

  const openOrderModal = (item: QuickOrderProduct) => {
    setProduct(item);
    setIsOpen(true);
  };

  const closeOrderModal = () => {
    setIsOpen(false);
  };

  return (
    <OrderModalContext.Provider
      value={{
        isOpen,
        product,
        openOrderModal,
        closeOrderModal,
      }}
    >
      {children}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(OrderModalContext);
  if (!context) {
    throw new Error("useOrderModal must be used within an OrderModalProvider");
  }
  return context;
}
