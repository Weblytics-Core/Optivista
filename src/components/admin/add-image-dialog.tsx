
"use client";

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SiteImage } from '@/lib/types';

interface AddImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSubmit: (data: Omit<SiteImage, 'id' | 'price'>) => void;
  initialData?: SiteImage | null;
  mode: 'add' | 'edit';
}

export function AddImageDialog({ open, onOpenChange, onFormSubmit, initialData, mode }: AddImageDialogProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [category, setCategory] = React.useState<SiteImage['category']>('nature');
  const [aiHint, setAiHint] = React.useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setUrl(initialData.url);
      setCategory(initialData.category);
      setAiHint(initialData.aiHint);
    } else {
      resetForm();
    }
  }, [initialData, mode, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setUrl('');
    setCategory('nature');
    setAiHint('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({
      name,
      description,
      url,
      category,
      aiHint,
    });
    if (mode === 'add') {
      resetForm();
    }
    onOpenChange(false);
  };
  
  const title = mode === 'edit' ? 'Edit Image' : 'Add New Image';
  const descriptionText = mode === 'edit' ? "Make changes to the image details. Click save when you're done." : "Fill in the details for the new image. Click save when you're done.";

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="font-headline">{title}</DialogTitle>
        <DialogDescription>{descriptionText}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Image URL
            </Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" placeholder="https://example.com/image.jpg" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={(value: SiteImage['category']) => setCategory(value)} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aiHint" className="text-right">
              AI Hint
            </Label>
            <Input id="aiHint" value={aiHint} onChange={(e) => setAiHint(e.target.value)} className="col-span-3" placeholder="e.g. mountain landscape"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       {dialogContent}
     </Dialog>
  );
}
