import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();

  const { content, group, index, authorId } = body;

  // check that valid user exists
  if (authorId) {
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!user)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });

  if (!task)
    return NextResponse.json({ error: "Invalid task" }, { status: 404 });

  const updatedTask = await prisma.task.update({
    where: { id: task.id },
    data: {
      content,
      group,
      index,
      authorId,
    },
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });

  if (!task)
    return NextResponse.json({ error: "Invalid task" }, { status: 404 });

  await prisma.task.delete({
    where: { id: task.id },
  });

  return NextResponse.json({});
}
