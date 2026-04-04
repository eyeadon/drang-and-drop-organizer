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

export function capitalizeFirstLetter(string: string | undefined) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

export async function saveBoard(
  boardId: number | null,
  data: {
    name?: string;
    content?: ColumnType;
    authorId?: number;
  },
  router: AppRouterInstance,
) {
  try {
    if (boardId !== null) {
      const result = await axios.patch<Board>("/api/boards/" + boardId, data);
      router.refresh();
      return result;
    }
    // create new board
    else {
      const result = await axios.post<Board>("/api/boards", data);
      router.refresh();
      return result;
    }
  } catch (error) {
    console.error("Error patching or posting data:", error);
  }
}
