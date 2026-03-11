import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "file"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Types ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter text…",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Password",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "0",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    placeholder: "Search…",
  },
};

export const File: Story = {
  args: {
    type: "file",
  },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Not editable",
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    defaultValue: "not-an-email",
    "aria-invalid": true,
  },
};

export const WithValue: Story = {
  name: "With Value",
  args: {
    type: "text",
    defaultValue: "Prefilled content",
  },
};

// ─── All States ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  name: "All States",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input type="text" placeholder="Default" />
      <Input type="text" defaultValue="With value" />
      <Input type="text" placeholder="Disabled" disabled />
      <Input
        type="email"
        defaultValue="not-an-email"
        aria-invalid
        placeholder="Invalid"
      />
      <Input type="file" />
    </div>
  ),
};
