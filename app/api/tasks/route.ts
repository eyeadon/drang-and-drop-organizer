import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { content, group, authorId } = body;

  const newTask = await prisma.task.create({
    data: {
      content,
      group,
      authorId,
    },
  });

  return NextResponse.json(newTask, { status: 201 });
}
