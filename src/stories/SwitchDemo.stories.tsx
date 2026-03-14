import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Switch } from "@/components/ui/switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: "sm"
  }
};

// ─── Checked ─────────────────────────────────────────────────────────────────

export const Checked: Story = {
  args: { defaultChecked: true },
};

// ─── Small ───────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm" },
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true },
};

// ─── Disabled Checked ────────────────────────────────────────────────────────

export const DisabledChecked: Story = {
  name: "Disabled Checked",
  args: { disabled: true, defaultChecked: true },
};

// ─── With Label ──────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm font-medium">
        Airplane Mode
      </label>
    </div>
  ),
};

// ─── All Sizes ───────────────────────────────────────────────────────────────

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Switch size="sm" defaultChecked />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="default" defaultChecked />
        <span className="text-sm">Default</span>
      </div>
    </div>
  ),
};
