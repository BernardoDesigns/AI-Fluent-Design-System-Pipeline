import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Type your message here...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {};

// ─── With Value ──────────────────────────────────────────────────────────────

export const WithValue: Story = {
  name: "With Value",
  args: {
    defaultValue:
      "This is a textarea with some pre-filled content to show how it looks with text inside.",
  },
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This textarea is disabled.",
  },
};

// ─── With Label ──────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea id="message" placeholder="Type your message here..." />
      <p className="text-xs text-muted-foreground">
        Your message will be sent to our support team.
      </p>
    </div>
  ),
};
