import { createContext, useContext } from 'react';
import type { IdentitasSekolah } from '../types';

interface IdentitasContextValue {
  identitas: IdentitasSekolah;
  updateIdentitas: (patch: Partial<IdentitasSekolah>) => void;
}

const IdentitasContext = createContext<IdentitasContextValue | null>(null);

export const IdentitasProvider = IdentitasContext.Provider;

export function useIdentitas(): IdentitasContextValue | null {
  return useContext(IdentitasContext);
}
