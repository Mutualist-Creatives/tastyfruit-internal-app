import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/products/[id]/order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { newOrder } = body;

    if (typeof newOrder !== "number") {
      return NextResponse.json(
        { error: "newOrder must be a number" },
        { status: 400 }
      );
    }

    // Update the product order
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { order: newOrder },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product order:", error);
    return NextResponse.json(
      { error: "Failed to update product order" },
      { status: 500 }
    );
  }
}
