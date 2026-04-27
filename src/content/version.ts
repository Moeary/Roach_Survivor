function formatVersionLabel(version: string) {
  return `v${version}`;
}

export const CURRENT_VERSION = formatVersionLabel(__APP_VERSION__);
