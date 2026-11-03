'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface SiteContentContextType {
  content: Record<string, string>;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({ content: {}, loading: true });

export default function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function getContentValue(content: Record<string, string>, key: string, fallback: string): string {
  return content[key] || fallback;
}