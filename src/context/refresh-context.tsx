
'use client';

import * as React from 'react';

interface RefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const RefreshContext = React.createContext<RefreshContextType | undefined>(
  undefined
);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = React.useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const value = { refreshKey, triggerRefresh };

  return (
    <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = React.useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
}
