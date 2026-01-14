/**
 * Test file for MetricCard component
 *
 * To run tests:
 * npm test -- metric-card.test.tsx
 * or
 * npx vitest run components/__tests__/metric-card.test.tsx
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard, MetricCardSkeleton } from "../metric-card";
import { Package } from "lucide-react";

describe("MetricCard", () => {
  it("renders basic metric card with title and value", () => {
    render(<MetricCard title="Total Konten" value={156} icon={Package} />);

    expect(screen.getByText("Total Konten")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <MetricCard
        title="Total Konten"
        value={156}
        subtitle="Semua jenis konten"
        icon={Package}
      />
    );

    expect(screen.getByText("Semua jenis konten")).toBeInTheDocument();
  });

  it("renders trend indicator with up direction", () => {
    render(
      <MetricCard
        title="Total Konten"
        value={156}
        icon={Package}
        trend={{
          value: 12,
          direction: "up",
          label: "vs minggu lalu",
        }}
      />
    );

    expect(screen.getByText("12%")).toBeInTheDocument();
    expect(screen.getByText("vs minggu lalu")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const { container } = render(
      <MetricCard
        title="Total Konten"
        value={156}
        icon={Package}
        loading={true}
      />
    );

    // Skeleton should be rendered
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();

    render(
      <MetricCard
        title="Total Konten"
        value={156}
        icon={Package}
        onClick={handleClick}
      />
    );

    const card = screen.getByText("Total Konten").closest('div[role="button"]');
    card?.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("MetricCardSkeleton", () => {
  it("renders skeleton loader", () => {
    const { container } = render(<MetricCardSkeleton />);

    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
