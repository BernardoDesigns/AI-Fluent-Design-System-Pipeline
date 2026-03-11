import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { variant: "default" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const SizeDefault: Story = {
  name: "Size / Default",
  args: { size: "default" },
};

export const SizeSm: Story = {
  name: "Size / Small",
  args: { size: "sm" },
};

export const SizeLg: Story = {
  name: "Size / Large",
  args: { size: "lg" },
};

export const SizeIcon: Story = {
  name: "Size / Icon",
  args: {
    size: "icon",
    children: <Search />,
    "aria-label": "Search",
  },
};

// ─── All variants at a glance ─────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "All Variants",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "destructive", "outline", "secondary", "ghost", "link"] as const).map(
        (variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        )
      )}
    </div>
  ),
};

// ─── All sizes at a glance ────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: "All Sizes",
  render: (args) => (
    <div className="flex flex-wrap items-end gap-3">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="default">Default</Button>
      <Button {...args} size="lg">Large</Button>
      <Button {...args} size="icon" aria-label="Search"><Search /></Button>
    </div>
  ),
};
