"use client";
import axios from "axios";
import { useState } from "react";
import { Task } from "../generated/prisma/client";

interface Props {
  id: number;
  removeTask: (id: number) => Promise<void>;
}

const ItemDropdownMenu = ({ id, removeTask }: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <div className="dropdown">
      <menu className="dropbtn">
        <svg
          className="mr-0.5 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 1 10 6H4.75V15.25H14V10A.75.75 0 0 1 15.5 10v5.25c0 .69-.56 1.25-1.25 1.25H4.75A1.25 1.25 0 0 1 3.5 15.25V5.75Z" />
        </svg>
      </menu>
      <div className="dropdown-content">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            // function
          }}
        >
          Edit
        </a>
        <a
          href="#"
          onClick={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            await removeTask(id);
            setSubmitting(false);
          }}
        >
          Delete
        </a>
      </div>
    </div>
  );
};

export default ItemDropdownMenu;
