"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { FruitTypeCard } from "@/components/fruit-type-card";

interface FruitType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  order: number;
}

interface FruitTypeGridProps {
  productId: string;
  fruitTypes: FruitType[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onReorder?: (fruitTypeId: string, newOrder: number) => void;
}

export function FruitTypeGrid({
  productId,
  fruitTypes,
  onView,
  onEdit,
  onDelete,
  onReorder,
}: FruitTypeGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental drags on touch)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    const oldIndex = fruitTypes.findIndex((ft) => ft.id === active.id);
    const newIndex = fruitTypes.findIndex((ft) => ft.id === over.id);

    // Call the reorder callback with the fruit type id and new order
    onReorder(active.id as string, newIndex);
  };

  return (
    <div className="space-y-4">
      {/* Add Fruit Type Button */}
      <div>
        <Link href={`/produk/${productId}/jenis-buah/tambah`}>
          <Button variant="outline" size="sm" className="min-h-[44px]">
            <Plus className="size-4 mr-2" />
            Tambah Jenis Buah
          </Button>
        </Link>
      </div>

      {/* Fruit Types Grid */}
      {fruitTypes.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fruitTypes.map((ft) => ft.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fruitTypes.map((fruitType) => (
                <FruitTypeCard
                  key={fruitType.id}
                  fruitType={fruitType}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReorder={onReorder}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          Belum ada jenis buah. Klik tombol di atas untuk menambahkan.
        </div>
      )}
    </div>
  );
}
