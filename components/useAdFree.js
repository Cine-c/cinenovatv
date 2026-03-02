import { createContext, useContext } from 'react';

export const AdFreeContext = createContext({ adFree: false, setAdFree: () => {} });

export function useAdFree() {
  return useContext(AdFreeContext);
}
