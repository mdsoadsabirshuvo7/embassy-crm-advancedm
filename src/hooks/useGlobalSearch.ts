import { useState, useEffect } from 'react';

export const useGlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isSearchOpen,
    setIsSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
  };
};