"use client";

import { useState } from "react";
import Image from "next/image";
import { GripVertical, Eye, Edit, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Fruit type data structure
 */
interface FruitType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  order: number;
}

/**
 * Props for the FruitTypeCard component
 */
interface FruitTypeCardProps {
  /** Fruit type data to display */
  fruitType: FruitType;
  /** Callback when view/detail button is clicked */
  onView: (id: string) => void;
  /** Callback when edit button is clicked */
  onEdit: (id: string) => void;
  /** Callback when delete button is clicked */
  onDelete: (id: string, name: string) => void;
  /** Optional callback for drag and drop reordering */
  onReorder?: (fruitTypeId: string, newOrder: number) => void;
}

/**
 * FruitTypeCard Component
 *
 * A visual card component that displays a fruit type with an image-dominant design.
 * Features hover overlay with action buttons and drag-and-drop support.
 *
 * Features:
 * - Image-dominant layout (4:3 aspect ratio)
 * - Hover overlay with action buttons (View, Edit, Delete)
 * - Drag handle for reordering
 * - Truncated description with ellipsis
 * - Smooth animations and transitions
 *
 * @example
 * ```tsx
 * <FruitTypeCard
 *   fruitType={fruitType}
 *   onView={(id) => setSelectedFruitType(id)}
 *   onEdit={(id) => router.push(`/produk/${productId}/jenis-buah/edit/${id}`)}
 *   onDelete={(id, name) => handleDelete(id, name)}
 * />
 * ```
 */
export function FruitTypeCard({
  fruitType,
  onView,
  onEdit,
  onDelete,
  onReorder,
}: FruitTypeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Setup drag and drop functionality using @dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fruitType.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView(fruitType.id);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 p-0",
          isDragging && "opacity-50 shadow-2xl scale-105 rotate-2"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onView(fruitType.id)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${fruitType.name}`}
      >
        {/* Drag Handle */}
        <button
          className="absolute top-2 right-2 z-20 cursor-grab active:cursor-grabbing bg-background/80 backdrop-blur-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out group-hover:scale-110 touch-none min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5 text-muted-foreground" />
        </button>

        {/* Image Section - 60% height */}
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={fruitType.image}
            alt={`${fruitType.name} - ${
              fruitType.description
                ? fruitType.description.substring(0, 50)
                : "Fruit type image"
            }`}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        </div>

        {/* Content Section - 40% height */}
        <div className="p-4">
          <h4 className="font-semibold text-base mb-1 line-clamp-1">
            {fruitType.name}
          </h4>
          {fruitType.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {fruitType.description}
            </p>
          )}
        </div>

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-center gap-2 p-4 transition-all duration-300 ease-out",
            isHovered
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] w-full sm:w-auto transition-all duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onView(fruitType.id);
            }}
          >
            <Eye className="size-4 mr-1" />
            Lihat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] w-full sm:w-auto transition-all duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(fruitType.id);
            }}
          >
            <Edit className="size-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="min-h-[44px] w-full sm:w-auto transition-all duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(fruitType.id, fruitType.name);
            }}
          >
            <Trash2 className="size-4 mr-1" />
            Hapus
          </Button>
        </div>
      </Card>
    </div>
  );
}
