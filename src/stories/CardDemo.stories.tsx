import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
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
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription className="font-serif">A short description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-muted-foreground">
          This is the main body of the card. It can contain any content.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">Cancel</Button>
        <Button size="sm" className="ml-2">Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Card {...args} size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Small Card</CardTitle>
        <CardDescription className="font-serif">Compact layout with reduced padding.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-muted-foreground">Tighter spacing for denser UIs.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

// ─── Compositions ─────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: "With Header Action",
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription className="font-serif">You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">Mark all read</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-muted-foreground">
          Inbox updates will appear here.
        </p>
      </CardContent>
    </Card>
  ),
};

export const ContentOnly: Story = {
  name: "Content Only",
  render: (args) => (
    <Card {...args} className="w-72">
      <CardContent>
        <p className="font-serif text-muted-foreground">
          A minimal card with no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      {(["default", "sm"] as const).map((size) => (
        <Card key={size} size={size} className="w-80">
          <CardHeader>
            <CardTitle>{size === "default" ? "Default" : "Small"} Card</CardTitle>
            <CardDescription className="font-serif">size="{size}"</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-muted-foreground">Card body content.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};
