import React from "react";

type SectionBadgeProps = {
  label: string;
  className?: string;
  wrapperClassName?: string;
};

export default function SectionBadge({
  label,
  className = "",
  wrapperClassName = "",
}: SectionBadgeProps) {
  return (
    <div className={wrapperClassName}>
      <div
        className={`font-bricolage-grotesque-condensed text-[#B5FE28] font-extrabold bg-[#003BE2] w-fit ${className}`}
      >
        {label}
      </div>
    </div>
  );
}
