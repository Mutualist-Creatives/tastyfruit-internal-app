"use client";

import Image from "next/image";
import { Star, Heart, Share2 } from "lucide-react";

interface ProductPreviewProps {
  product: {
    name: string;
    description?: string;
    category: string;
    imageUrl?: string;
    isActive: boolean;
    nutrition?: any;
  };
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  const nutritionData = product.nutrition || {
    calories: 52,
    protein: "0.3g",
    carbs: "14g",
    fiber: "2.4g",
    sugar: "10g",
    vitaminC: "53mg",
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 to-red-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Info */}
            <div className="text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white mb-4">
                {product.category}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {product.name}
              </h1>
              <div
                className="text-xl text-orange-100 mb-8 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description ||
                    "Buah segar berkualitas tinggi dengan rasa yang lezat dan bergizi.",
                }}
              />

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorit
                </button>
                <button className="border-2 border-white text-white p-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-white bg-opacity-20 rounded-3xl p-8 backdrop-blur-sm">
                {product.imageUrl ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} - ${product.category} preview image for web client`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-orange-800">
                      <div className="text-6xl mb-4">🥭</div>
                      <p className="text-lg font-medium">{product.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  product.isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {product.isActive ? "Aktif" : "Nonaktif"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Tentang Produk
            </h2>
            <div
              className="prose prose-lg text-slate-600 max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  product.description ||
                  `<p>${product.name} adalah buah segar berkualitas premium yang dipetik langsung dari kebun terpilih. 
                Dengan rasa yang manis dan tekstur yang sempurna, buah ini kaya akan vitamin dan mineral 
                yang baik untuk kesehatan tubuh.</p>
                <p>Buah ini sangat cocok untuk dikonsumsi langsung, dijadikan jus,
                atau sebagai bahan campuran smoothie dan salad buah. Kandungan
                antioksidan yang tinggi membantu menjaga kesehatan dan
                meningkatkan sistem imun tubuh.</p>`,
              }}
            />

            {/* Reviews */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Ulasan Pelanggan
              </h3>
              <div className="space-y-6">
                {[
                  {
                    name: "Sarah M.",
                    rating: 5,
                    comment:
                      "Buahnya segar banget dan manis! Packing juga rapi.",
                  },
                  {
                    name: "Budi S.",
                    rating: 5,
                    comment:
                      "Kualitas premium, sesuai dengan harga. Recommended!",
                  },
                  {
                    name: "Lisa K.",
                    rating: 4,
                    comment: "Enak dan segar, tapi agak mahal. Overall good!",
                  },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {review.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nutrition & Info */}
          <div className="space-y-8">
            {/* Nutrition Facts */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Informasi Gizi
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Kalori</span>
                  <span className="font-semibold">
                    {nutritionData.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Protein</span>
                  <span className="font-semibold">{nutritionData.protein}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Karbohidrat</span>
                  <span className="font-semibold">{nutritionData.carbs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Serat</span>
                  <span className="font-semibold">{nutritionData.fiber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Gula</span>
                  <span className="font-semibold">{nutritionData.sugar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Vitamin C</span>
                  <span className="font-semibold">
                    {nutritionData.vitaminC}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Informasi Produk
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Kategori</span>
                  <span className="font-semibold">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span
                    className={`font-semibold ${
                      product.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg text-white">
              <h3 className="text-xl font-bold mb-2">Konten Preview Produk</h3>
              <p className="text-orange-100 mb-4">
                Ini adalah tampilan preview produk untuk web client TastyFruit
              </p>
              <button className="w-full bg-white text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Lihat di Web Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
