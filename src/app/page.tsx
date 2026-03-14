"use client";

import { useState } from "react";
import { Moon, Sun, Terminal, AlertCircle, Search, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="rounded-xl border bg-card p-6">{children}</div>
    </section>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);

  function toggleDark() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bernardo Designs System
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Component Showcase — powered by the design-to-production pipeline
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-2">
        {/* Button */}
        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map(
              (v) => (
                <Button key={v} variant={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              )
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Search"><Search className="size-4" /></Button>
          </div>
        </Section>

        {/* Badge */}
        <Section title="Badge">
          <div className="flex flex-wrap items-center gap-3">
            {(["default", "secondary", "destructive", "outline"] as const).map(
              (v) => (
                <Badge key={v} variant={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Badge>
              )
            )}
          </div>
        </Section>

        {/* Card */}
        <Section title="Card">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Design tokens synced from Figma</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                12 components installed, 4 token collections mapped, Poppins loaded.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">View Details</Button>
              <Button size="sm" variant="outline">Dismiss</Button>
            </CardFooter>
          </Card>
        </Section>

        {/* Alert */}
        <Section title="Alert">
          <div className="space-y-3">
            <Alert>
              <Terminal className="size-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the CLI.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>
          </div>
        </Section>

        {/* Input */}
        <Section title="Input">
          <div className="space-y-3">
            <Input placeholder="Default input" />
            <Input disabled placeholder="Disabled input" />
            <div className="flex gap-2">
              <Input placeholder="With button..." />
              <Button>Subscribe</Button>
            </div>
          </div>
        </Section>

        {/* Textarea */}
        <Section title="Textarea">
          <div className="space-y-3">
            <div className="grid gap-1.5">
              <label htmlFor="showcase-textarea" className="text-sm font-medium">Message</label>
              <Textarea id="showcase-textarea" placeholder="Type your message here..." />
              <p className="text-xs text-muted-foreground">Max 500 characters.</p>
            </div>
            <Textarea disabled placeholder="Disabled textarea" />
          </div>
        </Section>

        {/* Select */}
        <Section title="Select">
          <div className="flex flex-wrap items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger size="sm" className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Section>

        {/* Switch */}
        <Section title="Switch">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="notifications" defaultChecked />
              <label htmlFor="notifications" className="text-sm font-medium">Notifications</label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="marketing" />
              <label htmlFor="marketing" className="text-sm font-medium">Marketing emails</label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="disabled-switch" disabled />
              <label htmlFor="disabled-switch" className="text-sm font-medium text-muted-foreground">Disabled</label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="small-switch" size="sm" defaultChecked />
              <label htmlFor="small-switch" className="text-sm font-medium">Small size</label>
            </div>
          </div>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <div className="space-y-6">
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <p className="text-sm text-muted-foreground pt-2">Manage your account settings.</p>
              </TabsContent>
              <TabsContent value="password">
                <p className="text-sm text-muted-foreground pt-2">Change your password here.</p>
              </TabsContent>
              <TabsContent value="billing">
                <p className="text-sm text-muted-foreground pt-2">Manage billing and subscriptions.</p>
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="overview">
              <TabsList variant="line">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <p className="text-sm text-muted-foreground pt-2">Line variant tabs.</p>
              </TabsContent>
              <TabsContent value="analytics">
                <p className="text-sm text-muted-foreground pt-2">Analytics view.</p>
              </TabsContent>
            </Tabs>
          </div>
        </Section>

        {/* Dialog */}
        <Section title="Dialog">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                  <Input placeholder="Name" defaultValue="Bernardo" />
                  <Input placeholder="Email" defaultValue="bernardo@example.com" />
                </div>
                <DialogFooter>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarImage src="https://github.com/shadcn.png" alt="Default" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>BD</AvatarFallback>
              </Avatar>
            </div>
            <AvatarGroup>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+5</AvatarGroupCount>
            </AvatarGroup>
          </div>
        </Section>

        {/* Separator */}
        <Section title="Separator">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Horizontal</p>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">Content below the separator.</p>
            </div>
            <div className="flex h-5 items-center gap-4 text-sm">
              <span>Blog</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Source</span>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <p className="text-xs text-muted-foreground">
            12 components &middot; 4 token collections &middot; Figma &rarr; Code
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">v1.0</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
