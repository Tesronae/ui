import { addons } from "storybook/manager-api";

// Maturity is tag metadata (`tags: ["maturity:<tier>"]` on a story's meta),
// never the story `title:` — that keeps existing story IDs and URLs stable
// across a maturity change. See design/docs/sandbox.md. `stable` is the
// expected default and gets no badge, so the sidebar stays quiet for the
// common case and only calls out what needs a second look.
const MATURITY_LABEL: Record<string, string> = {
  experimental: "Experimental",
  candidate: "Candidate",
  deprecated: "Deprecated",
};

const MATURITY_COLOR: Record<string, string> = {
  experimental: "#e0e0e0",
  candidate: "#fce8b2",
  deprecated: "#f4c7c3",
};

addons.setConfig({
  sidebar: {
    renderLabel: (item) => {
      const tag = item.tags?.find((t) => t.startsWith("maturity:"));
      const tier = tag?.slice("maturity:".length);
      const label = tier ? MATURITY_LABEL[tier] : undefined;
      if (!label) return item.name;

      return (
        <span>
          {item.name}
          <span
            style={{
              marginInlineStart: 6,
              fontSize: 10,
              lineHeight: "14px",
              padding: "0 4px",
              borderRadius: 3,
              background: MATURITY_COLOR[tier!],
              color: "#333",
            }}
          >
            {label}
          </span>
        </span>
      );
    },
  },
});
