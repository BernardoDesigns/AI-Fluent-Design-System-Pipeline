import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "@/components/ui/separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Horizontal ──────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Design System</h4>
        <p className="text-sm text-muted-foreground font-serif">
          Tokens, components, and patterns.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Storybook</h4>
        <p className="text-sm text-muted-foreground font-serif">
          Interactive component documentation.
        </p>
      </div>
    </div>
  ),
};

// ─── Vertical ────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  ),
};

// ─── In a List ───────────────────────────────────────────────────────────────

export const InAList: Story = {
  name: "In a List",
  render: () => (
    <div className="w-[250px]">
      {["Dashboard", "Settings", "Profile", "Logout"].map((item, i, arr) => (
        <div key={item}>
          <div className="py-2 text-sm">{item}</div>
          {i < arr.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  ),
};
