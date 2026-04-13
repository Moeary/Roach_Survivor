function formatVersionLabel(version: string) {
  const shortSemverMatch = /^(\d+)\.(\d+)\.0$/.exec(version);

  if (shortSemverMatch) {
    return `v${shortSemverMatch[1]}.${shortSemverMatch[2]}`;
  }

  return `v${version}`;
}

export const CURRENT_VERSION = formatVersionLabel(__APP_VERSION__);
