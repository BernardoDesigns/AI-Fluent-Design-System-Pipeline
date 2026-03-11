import "../src/app/globals.css";

import React, { useEffect } from "react";
import type { Preview } from "@storybook/nextjs-vite";

const withGeistFont = (Story: React.ComponentType) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Geist', sans-serif" }}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withGeistFont],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
