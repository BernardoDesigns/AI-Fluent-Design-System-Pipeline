import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, Info, Terminal, TriangleAlert } from "lucide-react";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Alert {...args} variant="default">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription className="font-serif">
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <Alert {...args} variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="font-serif">
        Your session has expired. Please log in again to continue.
      </AlertDescription>
    </Alert>
  ),
};

// ─── With Icons ───────────────────────────────────────────────────────────────

export const WithInfoIcon: Story = {
  name: "With Icon / Info",
  render: (args) => (
    <Alert {...args} variant="default">
      <Info />
      <AlertTitle>New feature available</AlertTitle>
      <AlertDescription className="font-serif">
        Check out the new dashboard experience in settings.
      </AlertDescription>
    </Alert>
  ),
};

export const WithTerminalIcon: Story = {
  name: "With Icon / Terminal",
  render: (args) => (
    <Alert {...args} variant="default">
      <Terminal />
      <AlertTitle>Run the following command</AlertTitle>
      <AlertDescription className="font-serif">
        <code className="font-mono text-xs">npx shadcn@latest add button</code>
      </AlertDescription>
    </Alert>
  ),
};

export const WithDestructiveIcon: Story = {
  name: "With Icon / Destructive",
  render: (args) => (
    <Alert {...args} variant="destructive">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="font-serif">
        Your payment method could not be verified. Please update your billing
        details.
      </AlertDescription>
    </Alert>
  ),
};

// ─── With Action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: "With Action",
  render: (args) => (
    <Alert {...args} variant="default">
      <Info />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription className="font-serif">
        A new version of the app is ready to install.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">Update</Button>
      </AlertAction>
    </Alert>
  ),
};

export const WithDestructiveAction: Story = {
  name: "With Action / Destructive",
  render: (args) => (
    <Alert {...args} variant="destructive">
      <TriangleAlert />
      <AlertTitle>Delete account</AlertTitle>
      <AlertDescription className="font-serif">
        This action is permanent and cannot be undone.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="destructive">Delete</Button>
      </AlertAction>
    </Alert>
  ),
};

// ─── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <Info />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription className="font-serif">Informational message for the user.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription className="font-serif">Something went wrong or needs attention.</AlertDescription>
      </Alert>
    </div>
  ),
};
