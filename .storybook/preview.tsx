import type { Preview } from "@storybook/react-vite";
import "../dist/tokens.css";
import "./preview.css";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text direction",
      toolbar: {
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description:
        "Reduced motion (review-only override — does not change the OS/browser setting; components' own reduced-motion behaviour still runs off the real prefers-reduced-motion media query outside Storybook)",
      toolbar: {
        icon: "accessibility",
        items: [
          { value: "no-preference", title: "Motion: on" },
          { value: "reduce", title: "Motion: reduced" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    direction: "ltr",
    motion: "no-preference",
  },
  parameters: {
    layout: "padded",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
    viewport: {
      options: {
        mobile: { name: "Mobile 375", styles: { width: "375px", height: "812px" } },
        narrow: { name: "Table stack 720", styles: { width: "720px", height: "900px" } },
        tablet: { name: "Tablet 860", styles: { width: "860px", height: "1000px" } },
        compactDesktop: { name: "Compact desktop 1080", styles: { width: "1080px", height: "900px" } },
        desktop: { name: "Desktop 1440", styles: { width: "1440px", height: "900px" } },
      },
    },
    options: {
      storySort: {
        order: ["Foundations", "Components", "Patterns", "Inspiration", "Experiments", "Approved"],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div
        className="story-root"
        data-theme={context.globals.theme === "dark" ? "dark" : "light"}
        data-motion={context.globals.motion === "reduce" ? "reduce" : "no-preference"}
        lang="en"
        dir={context.globals.direction === "rtl" ? "rtl" : "ltr"}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
