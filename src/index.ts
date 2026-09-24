export { Icon, ICONS, ICON_NAMES } from "./components/Icon";
export type { IconName } from "./components/Icon";

export { BarChart } from "./components/ui/BarChart";
export { Button } from "./components/ui/Button";
export { Checkbox } from "./components/ui/Checkbox";
export { Chip } from "./components/ui/Chip";
export { DataTable } from "./components/ui/DataTable";
export type { Column } from "./components/ui/DataTable";
export { Metric } from "./components/ui/Metric";
export { Modal } from "./components/ui/Modal";
export { Notice } from "./components/ui/Notice";
export { Pill } from "./components/ui/Pill";
export { Select } from "./components/ui/Select";
export type { SelectOption } from "./components/ui/Select";
export { Skeleton } from "./components/ui/Skeleton";
export { Sparkline } from "./components/ui/Sparkline";
export { TextField } from "./components/ui/TextField";
export { Toast } from "./components/ui/Toast";

export { buildRingArcs } from "./components/ui/chart-math";
export type { RingSegment } from "./components/ui/chart-math";

// RingGauge: the generic ring-chart primitive. Consuming apps compose it
// into a domain-specific name (e.g. IMS-web's StockHealthRing) rather than
// this package guessing every future project's own vocabulary for "a ring
// chart of segmented percentages."
export { RingGauge } from "./components/ui/RingGauge";
