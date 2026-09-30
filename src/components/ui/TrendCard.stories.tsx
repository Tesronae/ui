import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrendCard, type TrendCardDay } from "./TrendCard";

const LABELS = ["Sep 17", "Sep 18", "Sep 19", "Sep 20", "Sep 21", "Sep 22", "Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29", "Today"];
const VALUES = [1210, 1340, 980, 1560, 1720, 1490, 1630, 1580, 1710, 1840, 1690, 1760, 1900, 1846.5];
const DAYS: TrendCardDay[] = VALUES.map((v, i) => ({
  value: v,
  formatted: `AED ${v.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  label: LABELS[i]!,
}));

const meta = {
  title: "Components/TrendCard",
  component: TrendCard,
  tags: ["maturity:experimental"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A KPI/stat card: a resting value + delta pill, and a 14-point sparkline that swaps the value for a scrubbed day's exact figure on pointer move, focus, or Arrow/Home/End keys, announcing each read via aria-live. `days[].value` is a plain number used for curve shape only — the caller supplies the exact display text as `formatted`, formatted through its own decimal library. `tone` colors the line/area (good=pos, bad=neg, neutral=ink); `ownerOnly` adds a lock badge beside the label.",
      },
    },
  },
  args: {
    label: "Sales today",
    spokenLabel: "Sales today",
    value: "AED 1,846.50",
    delta: "+8.4%",
    days: DAYS,
    spokenUnit: "AED",
  },
} satisfies Meta<typeof TrendCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { tone: "good" } };

export const Bad: Story = { args: { tone: "bad", delta: "-3.1%" } };

export const OwnerOnly: Story = { args: { ownerOnly: true, tone: "neutral" } };
