"use client";

import Image from "next/image";
import { Star, Heart, Share2 } from "lucide-react";

interface FruitTypePreviewProps {
  fruitType: {
    name: string;
    slug: string;
    description?: string;
    image: string;
  };
}

export default function FruitTypePreview({ fruitType }: FruitTypePreviewProps) {
  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Fruit Type Info */}
            <div className="text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white mb-4">
                Jenis Buah
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                {fruitType.name}
              </h1>
              <div
                className="text-xl text-green-100 mb-8 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    fruitType.description ||
                    "Jenis buah berkualitas tinggi dengan rasa yang lezat dan bergizi.",
                }}
              />

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorit
                </button>
                <button className="border-2 border-white text-white p-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Fruit Type Image */}
            <div className="relative">
              <div className="aspect-square bg-white bg-opacity-20 rounded-3xl p-8 backdrop-blur-sm">
                {fruitType.image ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src={fruitType.image}
                      alt={`${fruitType.name} - Preview image for web client`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-green-800">
                      <div className="text-6xl mb-4">🍎</div>
                      <p className="text-lg font-medium">{fruitType.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fruit Type Details */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Tentang {fruitType.name}
            </h2>
            <div
              className="prose prose-lg text-slate-600 max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  fruitType.description ||
                  `<p>${fruitType.name} adalah jenis buah berkualitas premium yang dipetik langsung dari kebun terpilih. 
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
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
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

          {/* Info Sidebar */}
          <div className="space-y-8">
            {/* Fruit Type Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Informasi Jenis Buah
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Nama</span>
                  <span className="font-semibold">{fruitType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Slug</span>
                  <span className="font-semibold text-sm text-slate-500">
                    {fruitType.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg text-white">
              <h3 className="text-xl font-bold mb-2">
                Konten Preview Jenis Buah
              </h3>
              <p className="text-green-100 mb-4">
                Ini adalah tampilan preview jenis buah untuk web client
                TastyFruit
              </p>
              <button className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Lihat di Web Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
