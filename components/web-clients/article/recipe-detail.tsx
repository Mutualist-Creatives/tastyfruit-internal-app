"use client";

import Image from "next/image";
import SectionBadge from "../ui/section-badge";
import { RecipeDetailProps } from "../types";

interface RecipeDetailWithViewModeProps extends RecipeDetailProps {
  viewMode?: "desktop" | "mobile";
}

export default function RecipeDetail({
  recipe,
  viewMode,
}: RecipeDetailWithViewModeProps) {
  return (
    <article className="w-full mx-auto p-6">
      {/* ================================================================== */}
      {/* === MOBILE & TABLET LAYOUT ===                                   */}
      {/* ================================================================== */}
      <div className={viewMode === "desktop" ? "hidden" : "block"}>
        {/* Header */}
        <div className="flex flex-col items-start text-left gap-2 mb-8">
          <SectionBadge
            label="ARTIKEL TASTY"
            className="text-xs px-1 py-0.5 mb-1"
          />
          <div className="font-bricolage-grotesque-condensed text-[#003CE9] font-extrabold text-2xl bg-[#B5FE28] px-2 py-0.5">
            RESEP TASTY
          </div>
        </div>

        {/* Author and Title */}
        <div className="text-[#003CE9] mb-4">
          <p className="text-sm">
            Recipe by <span className="font-bold">{recipe.author}</span>
          </p>
          <h1
            className="font-bold text-5xl my-2 font-bricolage-grotesque-condensed"
            style={{
              fontFamily:
                'var(--font-bricolage-grotesque-condensed), "Bricolage Grotesque Condensed", "Bricolage Grotesque", sans-serif',
            }}
          >
            {recipe.name.toUpperCase()}
          </h1>
        </div>

        {/* Info Servings & Time */}
        <div className="text-[#003CE9]">
          <div className="flex items-center gap-4 text-sm text-[#003CE9]/80 mb-6">
            <p>{recipe.servings} servings</p>
            <div className="flex items-center gap-1.5">
              <Image
                src="/assets/artikel/resep-tasty/time.svg"
                alt="Time"
                width={16}
                height={16}
              />
              <span>{recipe.time}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full mb-8">
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={500}
            height={281}
            className="rounded-2xl object-cover w-full h-auto aspect-video"
          />
        </div>

        {/* Ingredients and Instructions */}
        <div className="text-[#003CE9]">
          <div className="mb-6">
            <h2 className="font-bold text-xl mb-3">Ingredients</h2>
            <ul className="space-y-3 border-t border-[#003CE9]/20 pt-3">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient.name}
                  className="flex justify-between items-start text-base"
                >
                  <div>
                    <span>{ingredient.name}</span>
                    {ingredient.note && (
                      <span className="block text-xs text-[#003CE9]/70 italic">
                        {ingredient.note}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-right flex-shrink-0 ml-4">
                    {ingredient.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-xl mb-3">Instructions</h2>
            <ol className="space-y-4 border-t border-[#003CE9]/20 pt-3 text-base leading-relaxed">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="font-bricolage-grotesque-condensed font-bold text-3xl text-[#003CE9]/50 mt-[-2px]">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="italic text-[#003CE9]/90">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* === DESKTOP LAYOUT ===                                           */}
      {/* ================================================================== */}
      <div className={viewMode === "mobile" ? "hidden" : "block"}>
        <div className="flex flex-col items-start text-left gap-2 mb-8">
          <SectionBadge
            label="ARTIKEL TASTY"
            className="text-2xl px-2 py-0.5 mb-5"
          />
          <div className="font-bricolage-grotesque-condensed text-[#003CE9] font-extrabold text-5xl bg-[#B5FE28] px-4 py-2">
            RESEP TASTY
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div className="w-full">
            <Image
              src={recipe.image}
              alt={recipe.name}
              width={500}
              height={500}
              className="rounded-2xl object-cover w-full h-auto aspect-square"
            />
          </div>
          <div className="text-[#003CE9]">
            <p className="text-sm">
              Recipe by <span className="font-bold">{recipe.author}</span>
            </p>
            <h1 className="font-bold text-7xl mb-2 font-bricolage-grotesque-condensed">
              {recipe.name.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#003CE9]/80 mb-6">
              <p>{recipe.servings} servings</p>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/assets/artikel/resep-tasty/time.svg"
                  alt="Time"
                  width={16}
                  height={16}
                />
                <span>{recipe.time}</span>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-bold text-xl mb-3">Ingredients</h2>
              <ul className="space-y-3 border-t border-[#003CE9]/20 pt-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.name}
                    className="flex justify-between items-start text-base"
                  >
                    <div>
                      <span>{ingredient.name}</span>
                      {ingredient.note && (
                        <span className="block text-xs text-[#003CE9]/70 italic">
                          {ingredient.note}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-right flex-shrink-0 ml-4">
                      {ingredient.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-xl mb-3">Instructions</h2>
              <ol className="space-y-4 border-t border-[#003CE9]/20 pt-3 text-base leading-relaxed">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="font-bricolage-grotesque-condensed font-bold text-3xl text-[#003CE9]/50 mt-[-2px]">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold">{step.title}</h3>
                      <p className="italic text-[#003CE9]/90">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
