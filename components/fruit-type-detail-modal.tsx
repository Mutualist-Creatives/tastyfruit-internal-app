"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FruitType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  order: number;
}

interface FruitTypeDetailModalProps {
  fruitType: FruitType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function FruitTypeDetailModal({
  fruitType,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: FruitTypeDetailModalProps) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Return focus to the previously focused element when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  if (!fruitType) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>{fruitType.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Large Image */}
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted">
            <Image
              src={fruitType.image}
              alt={`${fruitType.name} - Full size image showing ${
                fruitType.description ? "details" : "fruit type"
              }`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>

          {/* Slug Badge */}
          <div>
            <Badge variant="outline" className="font-mono text-xs">
              {fruitType.slug}
            </Badge>
          </div>

          {/* Description */}
          {fruitType.description && (
            <div>
              <h4 className="font-semibold mb-2">Deskripsi</h4>
              <div
                className="text-sm text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: fruitType.description }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onEdit(fruitType.id);
                onClose();
              }}
              className="flex-1"
            >
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(fruitType.id, fruitType.name);
                onClose();
              }}
              className="flex-1"
            >
              <Trash2 className="size-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
