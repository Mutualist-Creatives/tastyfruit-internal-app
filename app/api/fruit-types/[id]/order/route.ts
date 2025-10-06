import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/fruit-types/[id]/order
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

    // Update the fruit type order
    const fruitType = await prisma.fruitType.update({
      where: { id: params.id },
      data: { order: newOrder },
    });

    return NextResponse.json(fruitType);
  } catch (error) {
    console.error("Failed to update fruit type order:", error);
    return NextResponse.json(
      { error: "Failed to update fruit type order" },
      { status: 500 }
    );
  }
}
