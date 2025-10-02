import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updatePublicationSchema } from "@/lib/validations/publication";
import { ZodError } from "zod";

// GET /api/publications/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id: params.id },
    });

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Failed to fetch publication:", error);
    return NextResponse.json(
      { error: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}

// PUT /api/publications/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Handle publish/unpublish logic
    const updateData = { ...body };
    if (body.isPublished === true && !body.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (body.isPublished === false) {
      updateData.publishedAt = null;
    }

    // Validate input data
    const validatedData = updatePublicationSchema.parse(updateData);

    const publication = await prisma.publication.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(publication);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Failed to update publication:", error);
    return NextResponse.json(
      { error: "Failed to update publication" },
      { status: 500 }
    );
  }
}

// DELETE /api/publications/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.publication.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Failed to delete publication:", error);
    return NextResponse.json(
      { error: "Failed to delete publication" },
      { status: 500 }
    );
  }
}
