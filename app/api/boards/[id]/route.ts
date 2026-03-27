import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();

  const { name, content, authorId } = body;

  // check that valid user exists
  if (authorId) {
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!user)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const board = await prisma.board.findUnique({
    where: { id: parseInt(id) },
  });

  if (!board)
    return NextResponse.json({ error: "Invalid board" }, { status: 404 });

  const updatedBoard = await prisma.board.update({
    where: { id: board.id },
    data: {
      name,
      content,
      authorId,
    },
  });

  return NextResponse.json(updatedBoard);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const board = await prisma.board.findUnique({
    where: { id: parseInt(id) },
  });

  if (!board)
    return NextResponse.json({ error: "Invalid board" }, { status: 404 });

  await prisma.board.delete({
    where: { id: board.id },
  });

  return NextResponse.json({});
}
