"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Home, Loader2 } from "lucide-react";

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                FlowForge Design System
              </h1>
              <p className="mt-1 text-neutral-600">
                Complete UI component library
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Colors */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Color Palette
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Primary</CardTitle>
                  <CardDescription>Purple/Indigo gradient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-1">
                    <div className="h-12 w-12 rounded bg-primary-500" />
                    <div className="h-12 w-12 rounded bg-primary-600" />
                    <div className="h-12 w-12 rounded bg-primary-700" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secondary</CardTitle>
                  <CardDescription>Teal/Green gradient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-1">
                    <div className="h-12 w-12 rounded bg-secondary-500" />
                    <div className="h-12 w-12 rounded bg-secondary-600" />
                    <div className="h-12 w-12 rounded bg-secondary-700" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agents</CardTitle>
                  <CardDescription>Role-specific colors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-1">
                    <div className="h-12 w-12 rounded bg-[#8b5cf6]" />
                    <div className="h-12 w-12 rounded bg-[#0ea5e9]" />
                    <div className="h-12 w-12 rounded bg-[#10b981]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Buttons */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">Buttons</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Variants</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Sizes</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon">
                        <Home className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">States</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button loading>Loading</Button>
                      <Button disabled>Disabled</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Form Components */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Form Components
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="you@example.com" type="email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Option</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Choose an option</Label>
                    <RadioGroup defaultValue="option-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-1" id="option-1" />
                        <Label htmlFor="option-1">Option 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-2" id="option-2" />
                        <Label htmlFor="option-2">Option 2</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Badges & Avatars */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Badges & Avatars
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avatars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Avatar className="bg-primary-600">
                      <AvatarFallback className="bg-primary-600 text-white">
                        PM
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="bg-[#0ea5e9]">
                      <AvatarFallback className="bg-[#0ea5e9] text-white">
                        AR
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="bg-[#10b981]">
                      <AvatarFallback className="bg-[#10b981] text-white">
                        DV
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Tabs */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">Tabs</h2>
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <p className="text-sm text-neutral-600">
                      Manage your account settings and preferences.
                    </p>
                  </TabsContent>
                  <TabsContent value="password">
                    <p className="text-sm text-neutral-600">
                      Change your password and security settings.
                    </p>
                  </TabsContent>
                  <TabsContent value="settings">
                    <p className="text-sm text-neutral-600">
                      Configure application settings.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Dialog & Tooltip */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Dialog & Tooltip
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Example Dialog</DialogTitle>
                        <DialogDescription>
                          This is a modal dialog with a description.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-neutral-600">
                          Dialog content goes here.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">Hover me</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This is a tooltip</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
