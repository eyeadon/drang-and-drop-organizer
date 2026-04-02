const BoardName = ({ boardName }: { boardName: string | undefined }) => {
  return <h1>{boardName ? boardName : "Untitled Board"}</h1>;
};

export default BoardName;
