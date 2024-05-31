import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const loggedInAtom = atom(false);
export const loginStateAtom = atom(0);
export const tokenStorageAtom = atomWithStorage<null | string>("token", null);

export const longModeAtom = atom(false);
export const longModeLockedAtom = atom(false);
export const autoInvestigateUrlAtom = atom<null | string>(null);

export enum ModelType {
  CONTENT = "content",
  BALANCED = "balanced",
  IMBALANCED = "imbalanced",
}

export const selectedModelAtom = atom<ModelType>(ModelType.CONTENT);

export const currentUrlAtom = atom<undefined | null | string>(undefined);
