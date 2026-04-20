import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { postTaskSchema } from "../validationSchemas";

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = postTaskSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error, { status: 400 });

  const { content, authorId } = body;

  const newTask = await prisma.task.create({
    data: {
      content,
      authorId,
    },
  });

  return NextResponse.json(newTask, { status: 201 });
}
