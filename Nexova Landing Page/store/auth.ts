import { atom } from 'jotai';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types';

// Auth state atoms
export const userAtom = atom<User | null>(null);
export const sessionAtom = atom<Session | null>(null);
export const profileAtom = atom<Profile | null>(null);
export const authLoadingAtom = atom<boolean>(true);

// Derived atoms
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isPaidUserAtom = atom((get) => {
  const profile = get(profileAtom);
  return profile?.subscription_plan !== 'free';
});
