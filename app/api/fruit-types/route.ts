import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const fruitTypeSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  productId: z.string().min(1, "Product ID wajib diisi"),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    const where: any = {};
    if (productId) {
      where.productId = productId;
    }

    const fruitTypes = await prisma.fruitType.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ fruitTypes });
  } catch (error) {
    console.error("Error fetching fruit types:", error);
    return NextResponse.json(
      { error: "Failed to fetch fruit types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = fruitTypeSchema.parse(body);

    const fruitType = await prisma.fruitType.create({
      data: validatedData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(fruitType, { status: 201 });
  } catch (error: any) {
    console.error("Error creating fruit type:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create fruit type" },
      { status: 500 }
    );
  }
}
