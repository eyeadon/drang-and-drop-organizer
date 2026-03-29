import axios from "axios";
import { ColumnType } from "./components/BoardView";
import { Board } from "./generated/prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface StringColumnType {
  [key: string]: string[];
}

export function columnTasksToStrings(cols: ColumnType) {
  let columnKeys = Object.keys(cols);
  let updatedColumns: StringColumnType = {};

  columnKeys.forEach((key) => {
    updatedColumns[key] = cols[key].map((task) => task.content);
  });

  return updatedColumns;
}

export async function saveBoard(
  boardId: number | null,
  data: {
    name: string;
    content: ColumnType;
    authorId: number;
  },
  router: AppRouterInstance,
) {
  try {
    if (boardId !== null) {
      await axios.patch("/api/boards/" + boardId, data);
      router.refresh();
    }
    // create new board
    else {
      await axios.post("/api/boards", data);
      router.refresh();
    }
  } catch (error) {
    console.error("Error patching or posting data:", error);
  }
}
