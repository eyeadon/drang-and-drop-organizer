import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const boards = await prisma.board.findMany();
  return NextResponse.json(boards);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { content, authorId } = body;

  const newBoard = await prisma.board.create({
    data: {
      content,
      authorId,
    },
  });

  return NextResponse.json(newBoard, { status: 201 });
}
