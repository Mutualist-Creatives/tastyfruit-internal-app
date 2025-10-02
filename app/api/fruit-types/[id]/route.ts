import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateFruitTypeSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi").optional(),
  name: z.string().min(1, "Nama wajib diisi").optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fruitType = await prisma.fruitType.findUnique({
      where: { id: params.id },
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

    if (!fruitType) {
      return NextResponse.json(
        { error: "Fruit type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(fruitType);
  } catch (error) {
    console.error("Error fetching fruit type:", error);
    return NextResponse.json(
      { error: "Failed to fetch fruit type" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateFruitTypeSchema.parse(body);

    const fruitType = await prisma.fruitType.update({
      where: { id: params.id },
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

    return NextResponse.json(fruitType);
  } catch (error: any) {
    console.error("Error updating fruit type:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update fruit type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.fruitType.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Fruit type deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting fruit type:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete fruit type" },
      { status: 500 }
    );
  }
}
