/*
 * Icon registry — general-purpose icon set. One family: 24x24 grid, 1.6
 * stroke, round cap/join, no exceptions. Do not pull in an icon package
 * (lucide, heroicons): a second stroke weight/grid is exactly what this
 * registry exists to prevent. Consuming apps extend this registry with
 * their own domain icons by spreading ICONS into a local superset object
 * (see Icon.tsx's own docstring for the pattern) rather than editing this
 * file.
 *
 * Inner markup is injected via dangerouslySetInnerHTML rather than
 * hand-converted to JSX elements, so each entry stays byte-for-byte
 * identical to its source — no risk of a hand-transcription slip turning
 * "1.6" into "1.5" three levels of JSX deep. Content is a static,
 * developer-authored registry, never user or API input.
 */

export const ICONS = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/>',
  bell: '<path d="M6 9.5a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5z"/><path d="M10 18.5a2.2 2.2 0 0 0 4 0"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2.1-2.4 3.6M12 17.2v.2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"/>',
  moon: '<path d="M20 14.2A8.5 8.5 0 0 1 9.8 4a8.6 8.6 0 1 0 10.2 10.2z"/>',
  down: '<path d="M6 9.5 12 15.5l6-6"/>',
  right: '<path d="M9.5 5.5 15.5 12l-6 6.5"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  dn: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M4.5 12.5 9.5 17.5 19.5 7"/>',
  checkcircle: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.5 2.5 4.5-5"/>',
  alert: '<path d="M12 3.5 21.5 20H2.5z"/><path d="M12 10v4M12 17.2v.2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.3l3.4 2"/>',
  archive: '<rect x="3.5" y="4.5" width="17" height="4" rx="1.2"/><path d="M5.5 8.5v10a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-10M10 12.5h4"/>',
  download: '<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15"/>',
  filter: '<path d="M4 6.5h16M7 12h10M10 17.5h4"/>',
  truck: '<path d="M2.5 6.5h11v9h-11zM13.5 9.5H17l3.5 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  scan: '<path d="M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16"/><path d="M7.5 8.5v7M11 8.5v7M14 8.5v7M16.5 8.5v7"/>',
  box: '<path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16z"/><path d="M3.5 8 12 12.5 20.5 8M12 12.5v8"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20.5 4v4h-4"/>',
  offline: '<path d="M3 4l18 16"/><path d="M5 12.5a11 11 0 0 1 3.4-2.3M2 8.8A16 16 0 0 1 7 6M17 6.4A16 16 0 0 1 22 8.8M15.6 10.4a11 11 0 0 1 3.4 2.1M9 16a6 6 0 0 1 6 0M12 20v.2"/>',
  lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
  sort: '<path d="M8 9.5 12 5.5l4 4M8 14.5l4 4 4-4"/>',
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function Icon({
  name,
  size = 18,
  registry = ICONS,
}: {
  name: string;
  size?: number;
  /** A consuming app's own superset registry (its icons plus this
   * package's), so `Icon` renders both without this component needing to
   * know about domain-specific names. Defaults to this package's own set. */
  registry?: Record<string, string>;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: registry[name] ?? "" }}
    />
  );
}
