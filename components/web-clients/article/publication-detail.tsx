"use client";

import Image from "next/image";
import Link from "next/link";
import SectionBadge from "../ui/section-badge";
import { PublicationDetailProps } from "../types";

interface PublicationDetailWithViewModeProps extends PublicationDetailProps {
  viewMode?: "desktop" | "mobile";
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Event":
      return "bg-[#003BE2] text-white";
    case "Activities":
      return "bg-[#E30E75] text-white";
    case "Product":
      return "bg-[#FFE600] text-[#003BE2]";
    case "Information":
      return "bg-[#00C896] text-white";
    default:
      return "bg-[#003BE2] text-[#B5FE28]";
  }
};

export default function PublicationDetail({
  article,
  nextArticle,
  sanitizedContent,
  viewMode = "desktop",
}: PublicationDetailWithViewModeProps) {
  return (
    <section className="w-full h-auto rounded-xl p-6">
      {/* ================================================================== */}
      {/* === MOBILE LAYOUT ===                                            */}
      {/* ================================================================== */}
      <div className={viewMode === "desktop" ? "hidden" : "block"}>
        {/* Page Titles (Aligned left) */}
        <div className="flex flex-col items-start gap-2 mb-8 relative">
          <SectionBadge
            label="ARTIKEL TASTY"
            className="text-xs px-1 py-0.5 mb-1"
          />
          <div className="font-bricolage-grotesque-condensed text-[#003CE9] font-extrabold text-2xl bg-[#B5FE28] px-2 py-0.5">
            PUBLIKASI
          </div>
        </div>
        <div className="mx-auto relative flex flex-col items-start">
          {/* Main Article Content Wrapper */}
          <div className="mx-auto w-full font-nunito text-[#003BE2]">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-[#003CE9] text-center font-bricolage-grotesque leading-tight">
                {article.title}
              </h1>

              <div className="relative my-4">
                <div
                  className={`absolute top-4 left-4 z-10 inline-block px-2 py-1 rounded-full text-sm font-bold ${getCategoryColor(
                    article.category
                  )}`}
                >
                  {article.category}
                </div>
                <Image
                  src={article.image}
                  alt={article.title}
                  width={896}
                  height={504}
                  className="w-full h-[20em] object-cover rounded-2xl"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">{article.date}</span>
                <span>
                  by <span className="font-bold"> {article.author}</span>
                </span>
              </div>

              <article
                className="prose max-w-none text-justify"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* === DESKTOP LAYOUT ===                                           */}
      {/* ================================================================== */}
      <div className={viewMode === "mobile" ? "hidden" : "block"}>
        {/* Page Titles (Aligned left) */}
        <div className="flex flex-col items-start gap-2 mb-8 relative">
          <SectionBadge
            label="ARTIKEL TASTY"
            className="text-2xl px-2 py-0.5 mb-1"
          />
          <div className="font-bricolage-grotesque-condensed text-[#003CE9] font-extrabold text-5xl bg-[#B5FE28] px-4 py-2">
            PUBLIKASI
          </div>
        </div>
        <div className="mx-auto relative flex flex-col items-start max-w-3xl">
          {/* Main Article Content Wrapper */}
          <div className="mx-auto w-full font-nunito text-[#003BE2]">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-[#003CE9] text-center font-bricolage-grotesque leading-tight">
                {article.title}
              </h1>

              <div className="relative my-4">
                <div
                  className={`absolute top-4 left-4 z-10 inline-block px-2 py-1 rounded-full text-sm font-bold ${getCategoryColor(
                    article.category
                  )}`}
                >
                  {article.category}
                </div>
                <Image
                  src={article.image}
                  alt={article.title}
                  width={896}
                  height={504}
                  className="w-full h-[25em] object-cover rounded-2xl"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-bold">{article.date}</span>
                <span>
                  by <span className="font-bold"> {article.author}</span>
                </span>
              </div>

              <article
                className="prose lg:prose-lg max-w-none text-justify"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>
          </div>

          {/* Next Article Navigation Button (Aligned right) */}
          <div className="flex justify-end pt-8 w-full">
            <Link
              href={`/article/publication/${nextArticle.id}`}
              className="block hover:scale-110 transition-transform duration-300"
            >
              <div className="bg-[#B5FE28] rounded-full w-16 h-16 flex items-center justify-center">
                <Image
                  src="/assets/ui/arrow-right-blue.svg"
                  alt="Next article"
                  width={24}
                  height={24}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
