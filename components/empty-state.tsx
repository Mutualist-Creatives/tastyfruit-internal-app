import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";

interface EmptyStateProps {
  variant?: "no-data" | "no-results";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  icon?: ReactNode;
}

export function EmptyState({
  variant = "no-data",
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  const defaultIcon =
    variant === "no-results" ? (
      <Search className="size-12 text-muted-foreground" />
    ) : (
      <Package className="size-12 text-muted-foreground" />
    );

  return (
    <div className="bg-white rounded-lg border p-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="rounded-full bg-muted p-6">{icon || defaultIcon}</div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        </div>

        {/* Action Button */}
        {action && (
          <Button onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
