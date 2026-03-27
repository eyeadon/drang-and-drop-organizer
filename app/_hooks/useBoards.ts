import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Board } from "../generated/prisma/client";

const useBoards = () =>
  useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: () => axios.get<Board[]>("/api/boards").then((res) => res.data),
    staleTime: Infinity,
  });

export default useBoards;
