"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { DEFAULT_SITE_CONTENT, SiteContent, LocalizedText } from "@/data/defaultContent";

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
  refreshContent: () => Promise<void>;
  updateContent: (newContent: SiteContent) => Promise<{ success: boolean; error?: string }>;
  resetContent: () => Promise<{ success: boolean; error?: string }>;
  getLocalized: (textObj?: LocalizedText, lang?: "en" | "bn") => string;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (res.ok) {
        const data: SiteContent = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.warn("Could not fetch latest siteContent, using current state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const updateContent = async (newContent: SiteContent) => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(newContent);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to update content" };
    } catch (error: any) {
      return { success: false, error: error?.message || "Network error while saving" };
    }
  };

  const resetContent = async () => {
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(DEFAULT_SITE_CONTENT);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to reset content" };
    } catch (error: any) {
      return { success: false, error: error?.message || "Network error while resetting" };
    }
  };

  const getLocalized = (textObj?: LocalizedText, lang: "en" | "bn" = "en") => {
    if (!textObj) return "";
    return textObj[lang] || textObj.en || "";
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        refreshContent,
        updateContent,
        resetContent,
        getLocalized,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
