"use client"

import { toast } from "sonner"

import { Field } from "@/components/ui/field"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

function Swatch({ title }: { title: string }) {
  return (
    <div className="grid gap-8 rounded-3xl bg-background p-6 text-foreground">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Glass</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="whatsapp">WhatsApp</Button>
        <Button loading>Saving</Button>
        <Button disabled>Disabled</Button>
      </div>
      <Field label="Name" htmlFor={`${title}-name`}>
        <Input id={`${title}-name`} name="name" autoComplete="name" placeholder="Your name" />
      </Field>
      <Field label="Notes" htmlFor={`${title}-notes`} error="Add a short note.">
        <Textarea id={`${title}-notes`} aria-describedby={`${title}-notes-error`} defaultValue="" />
      </Field>
      <Field label="Studio" htmlFor={`${title}-studio`}>
        <Select defaultValue="podcast-setup">
          <SelectTrigger id={`${title}-studio`} aria-label="Studio">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="podcast-setup">Podcast Setup</SelectItem>
            <SelectItem value="empty-studio">Empty Studio Space</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>
      <Accordion>
        <AccordionItem value="faq">
          <AccordionTrigger>How do I enquire?</AccordionTrigger>
          <AccordionContent>Every enquiry continues on WhatsApp.</AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog</DialogTitle>
              <DialogDescription>Blurred overlay, close with Escape.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet</SheetTitle>
              <SheetDescription>Side panel for longer tasks.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Drawer>
          <DrawerTrigger render={<Button variant="outline" />}>Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer</DrawerTitle>
              <DrawerDescription>Swipe down to close on a phone.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <Button variant="secondary" type="button" onClick={() => toast.success("Saved")}>
          Toast
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Popular</Badge>
        <Badge variant="outline">Sample</Badge>
        <Skeleton className="h-8 w-24" />
      </div>
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Card</CardTitle>
        </CardHeader>
        <CardContent>Reusable surface for studio and pricing blocks.</CardContent>
      </Card>
      <Calendar mode="single" className="rounded-2xl border border-border" />
    </div>
  )
}

export function UiGallery() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 lg:grid-cols-2">
      <h1 className="font-display text-4xl lg:col-span-2">UI kit</h1>
      <div className="light rounded-3xl border border-border">
        <Swatch title="Light" />
      </div>
      <div className="dark rounded-3xl border border-border">
        <Swatch title="Dark" />
      </div>
    </div>
  )
}
