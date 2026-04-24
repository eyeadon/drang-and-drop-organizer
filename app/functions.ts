import axios from "axios";
import { ColumnType } from "./components/BoardView";
import { Board } from "./generated/prisma/client";

export function capitalizeFirstLetter(string: string | undefined) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

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
    name?: string;
    content?: ColumnType;
    authorId?: number;
  },
) {
  try {
    if (boardId !== null) {
      return await axios.patch<Board>("/api/boards/" + boardId, data);
    }
    // create new board
    else {
      return await axios.post<Board>("/api/boards", data);
    }
  } catch (error) {
    console.error("Error patching or posting data:", error);
  }
}
