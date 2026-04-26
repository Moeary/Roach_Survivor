import type { MetaProfile } from "../types";
import { DEFAULT_META_PROFILE, normalizeMetaProfile } from "./definitions";

const SAVE_COOKIE_KEY = "roach-survivor-save";
const SAVE_STORAGE_KEY = "roach-survivor-save";

function readCookieValue(key: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${key}=`;
  const entry = document.cookie
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith(prefix));

  return entry ? entry.slice(prefix.length) : null;
}

function readStorageValue(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: string, value: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    // Keep the game playable when storage is unavailable in private or embedded contexts.
    return false;
  }
}

function expireSaveCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SAVE_COOKIE_KEY}=; max-age=0; path=/; SameSite=Lax`;
}

function parseMetaProfile(raw: string, shouldDecode: boolean): MetaProfile | null {
  try {
    const serialized = shouldDecode ? decodeURIComponent(raw) : raw;
    return normalizeMetaProfile(JSON.parse(serialized) as Partial<MetaProfile>);
  } catch {
    return null;
  }
}

export function loadMetaProfile(): MetaProfile {
  const storedProfile = parseMetaProfile(readStorageValue(SAVE_STORAGE_KEY) || "", false);

  if (storedProfile) {
    expireSaveCookie();
    return storedProfile;
  }

  const cookieProfile = parseMetaProfile(readCookieValue(SAVE_COOKIE_KEY) || "", true);

  if (cookieProfile) {
    if (writeStorageValue(SAVE_STORAGE_KEY, JSON.stringify(cookieProfile))) {
      expireSaveCookie();
    }
    return cookieProfile;
  }

  return DEFAULT_META_PROFILE;
}

export function saveMetaProfile(profile: MetaProfile): void {
  if (writeStorageValue(SAVE_STORAGE_KEY, JSON.stringify(normalizeMetaProfile(profile)))) {
    expireSaveCookie();
  }
}
