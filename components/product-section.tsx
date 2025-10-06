"use client";

import Image from "next/image";
import { GripVertical, MoreVertical, Edit, Trash2, Power } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Product data structure for the CMS
 */
interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

/**
 * Props for the ProductSection component
 */
interface ProductSectionProps {
  /** Product data to display */
  product: Product;
  /** Whether the section is currently expanded */
  isExpanded: boolean;
  /** Callback when the section is toggled */
  onToggle: () => void;
  /** Callback when edit button is clicked */
  onEdit: (id: string) => void;
  /** Callback when delete button is clicked */
  onDelete: (id: string, name: string) => void;
  /** Callback when status toggle is clicked */
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  /** Optional callback for drag and drop reordering */
  onReorder?: (productId: string, newOrder: number) => void;
  /** Child components (typically FruitTypeGrid) */
  children?: React.ReactNode;
}

/**
 * ProductSection Component
 *
 * A collapsible card section that displays a product with its details and actions.
 * Supports drag-and-drop reordering and contains child fruit type cards.
 *
 * Features:
 * - Collapsible content with smooth animations
 * - Drag handle for reordering products
 * - Action menu (Edit, Delete, Toggle Status)
 * - Status badge (Active/Inactive)
 * - Product image and description
 * - Contains FruitTypeGrid as children
 *
 * @example
 * ```tsx
 * <ProductSection
 *   product={product}
 *   isExpanded={true}
 *   onToggle={() => setExpanded(!expanded)}
 *   onEdit={(id) => router.push(`/produk/edit/${id}`)}
 *   onDelete={(id, name) => handleDelete(id, name)}
 *   onToggleStatus={(id, status) => handleToggleStatus(id, status)}
 * >
 *   <FruitTypeGrid fruitTypes={product.fruitTypes} />
 * </ProductSection>
 * ```
 */
export function ProductSection({
  product,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
  children,
}: ProductSectionProps) {
  // Setup drag and drop functionality using @dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <Card
          className={cn(
            "transition-all duration-300 ease-out",
            isExpanded && "border-primary shadow-md",
            isDragging &&
              "opacity-50 shadow-2xl scale-105 rotate-2 ring-2 ring-primary/50"
          )}
        >
          <CollapsibleTrigger asChild>
            <div
              className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 cursor-pointer hover:bg-accent/50 transition-all duration-200 ease-out"
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${
                product.name
              } section`}
            >
              {/* Drag Handle */}
              <button
                className="mt-1 cursor-grab active:cursor-grabbing hover:text-primary hover:scale-110 transition-all duration-200 ease-out touch-none min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 sm:ml-0"
                onClick={(e) => e.stopPropagation()}
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="size-5 text-muted-foreground" />
              </button>

              {/* Product Image */}
              {product.imageUrl && (
                <div className="relative size-14 sm:size-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} - ${product.category}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 56px, 64px"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.category}
                    </p>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Status Badge and Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={product.isActive ? "default" : "outline"}>
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="min-w-[44px] min-h-[44px]"
                        >
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(product.id);
                          }}
                          className="min-h-[44px]"
                        >
                          <Edit className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(product.id, product.isActive);
                          }}
                          className="min-h-[44px]"
                        >
                          <Power className="size-4 mr-2" />
                          {product.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product.id, product.name);
                          }}
                          className="text-destructive focus:text-destructive min-h-[44px]"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t">
              {children}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
