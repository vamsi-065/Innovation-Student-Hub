import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { generateRoomId, apiError, apiSuccess } from "@/lib/utils";

// GET /api/messages/[roomId] — fetch chat history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const messages = await prisma.message.findMany({
      where: { roomId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    // Mark messages as read for this user
    await prisma.message.updateMany({
      where: { roomId, receiverId: authUser.userId, read: false },
      data: { read: true },
    });

    return apiSuccess(messages);
  } catch (err) {
    console.error("[MESSAGES GET]", err);
    return apiError("Internal server error", 500);
  }
}

// POST /api/messages/[roomId] — send a message (REST fallback)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) return apiError("Unauthorized", 401);

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      return apiError("Receiver ID and content are required", 400);
    }

    const expectedRoomId = generateRoomId(authUser.userId, receiverId);
    if (roomId !== expectedRoomId) {
      return apiError("Invalid room ID", 400);
    }

    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: authUser.userId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    return apiSuccess(message, 201);
  } catch (err) {
    console.error("[MESSAGE POST]", err);
    return apiError("Internal server error", 500);
  }
}
