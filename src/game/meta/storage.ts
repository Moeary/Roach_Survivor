import type { MetaProfile } from "../types";
import { DEFAULT_META_PROFILE, normalizeMetaProfile } from "./definitions";

const SAVE_COOKIE_KEY = "roach-survivor-save";
const SAVE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;

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

export function loadMetaProfile(): MetaProfile {
  const raw = readCookieValue(SAVE_COOKIE_KEY);

  if (!raw) {
    return DEFAULT_META_PROFILE;
  }

  try {
    return normalizeMetaProfile(JSON.parse(decodeURIComponent(raw)) as Partial<MetaProfile>);
  } catch {
    return DEFAULT_META_PROFILE;
  }
}

export function saveMetaProfile(profile: MetaProfile): void {
  if (typeof document === "undefined") {
    return;
  }

  const serialized = encodeURIComponent(JSON.stringify(normalizeMetaProfile(profile)));
  document.cookie = `${SAVE_COOKIE_KEY}=${serialized}; max-age=${SAVE_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}
