import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        university: true,
        department: true,
        year: true,
        skills: true,
        interests: true,
        githubUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
        createdAt: true,
        ideas: {
          select: {
            id: true,
            title: true,
            status: true,
            tags: true,
            createdAt: true,
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        reviews: {
          select: {
            id: true,
            content: true,
            rating: true,
            status: true,
            createdAt: true,
            idea: { select: { id: true, title: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            ideas: true,
            reviews: true,
            teamMembers: true,
          },
        },
      },
    });

    if (!user) return apiError("User not found", 404);
    return apiSuccess(user);
  } catch (err) {
    console.error("[USER GET]", err);
    return apiError("Internal server error", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      bio,
      university,
      department,
      year,
      skills,
      interests,
      githubUrl,
      linkedinUrl,
      websiteUrl,
      avatar,
    } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(university !== undefined && { university }),
        ...(department !== undefined && { department }),
        ...(year !== undefined && { year }),
        ...(skills && { skills }),
        ...(interests && { interests }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        university: true,
        department: true,
        year: true,
        skills: true,
        interests: true,
        githubUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
      },
    });

    return apiSuccess(user);
  } catch (err) {
    console.error("[USER PATCH]", err);
    return apiError("Internal server error", 500);
  }
}
