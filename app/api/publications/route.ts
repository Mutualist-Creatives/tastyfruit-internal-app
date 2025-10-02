import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPublicationSchema } from "@/lib/validations/publication";
import { ZodError } from "zod";

// GET /api/publications
export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(publications);
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

// POST /api/publications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = createPublicationSchema.parse(body);

    const publication = await prisma.publication.create({
      data: validatedData,
    });

    return NextResponse.json(publication, { status: 201 });
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

    console.error("Failed to create publication:", error);
    return NextResponse.json(
      { error: "Failed to create publication" },
      { status: 500 }
    );
  }
}
