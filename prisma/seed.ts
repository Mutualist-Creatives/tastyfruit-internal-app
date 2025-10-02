import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Mangga Harum Manis",
        description: "Mangga segar dengan rasa manis dan harum yang khas",
        price: 25000,
        category: "Buah Segar",
        stock: 50,
        imageUrl: "https://example.com/mangga.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Buah Naga Merah",
        description: "Buah naga merah segar kaya antioksidan",
        price: 35000,
        category: "Buah Segar",
        stock: 30,
        imageUrl: "https://example.com/buah-naga.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Jus Jeruk Segar",
        description: "Jus jeruk segar tanpa pengawet",
        price: 15000,
        category: "Jus Buah",
        stock: 100,
        imageUrl: "https://example.com/jus-jeruk.jpg",
      },
    }),
  ]);

  // Seed Recipes
  const recipes = await Promise.all([
    prisma.recipe.create({
      data: {
        title: "Smoothie Bowl Mangga Naga",
        description:
          "Smoothie bowl segar dengan kombinasi mangga dan buah naga",
        ingredients: [
          "1 buah mangga matang",
          "1/2 buah naga merah",
          "1 pisang beku",
          "100ml susu almond",
          "Topping: granola, kacang almond",
        ],
        instructions:
          "1. Blender semua buah dengan susu almond\n2. Tuang ke dalam bowl\n3. Tambahkan topping sesuai selera",
        cookingTime: 15,
        servings: 2,
        difficulty: "Easy",
        isPublished: true,
      },
    }),
    prisma.recipe.create({
      data: {
        title: "Salad Buah Tropis",
        description: "Salad buah segar dengan dressing madu jeruk nipis",
        ingredients: [
          "1 buah mangga",
          "1 buah nanas",
          "2 buah kiwi",
          "1 buah pepaya",
          "2 sdm madu",
          "1 jeruk nipis",
        ],
        instructions:
          "1. Potong semua buah dadu\n2. Campur madu dengan perasan jeruk nipis\n3. Siram dressing ke atas buah",
        cookingTime: 20,
        servings: 4,
        difficulty: "Easy",
        isPublished: true,
      },
    }),
  ]);

  // Seed Publications
  const publications = await Promise.all([
    prisma.publication.create({
      data: {
        title: "Manfaat Buah Naga untuk Kesehatan",
        content:
          "Buah naga merupakan salah satu buah tropis yang kaya akan nutrisi...",
        excerpt:
          "Buah naga kaya akan antioksidan dan vitamin C yang baik untuk sistem imun tubuh.",
        author: "Admin TastyFruit",
        category: "Kesehatan",
        isPublished: true,
        publishedAt: new Date(),
      },
    }),
    prisma.publication.create({
      data: {
        title: "Tips Memilih Buah Segar di Pasar",
        content: "Memilih buah segar yang berkualitas memerlukan ketelitian...",
        excerpt:
          "Panduan lengkap untuk memilih buah-buahan segar dengan kualitas terbaik.",
        author: "Admin TastyFruit",
        category: "Tips",
        isPublished: false,
      },
    }),
  ]);

  // Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@tastyfruit.com",
        name: "Admin TastyFruit",
        role: "admin",
      },
    }),
  ]);

  console.log("Seed data created successfully!");
  console.log({ products, recipes, publications, users });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
