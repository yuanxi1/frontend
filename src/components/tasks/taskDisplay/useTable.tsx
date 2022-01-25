import {
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function useTable(
  headCells: {
    id: string;
    label: string;
  }[]
) {
  

  const TblContainer = (props: any) => {
    return <Table stickyHeader sx={{ width: '100%', maxWidth:'320'}}>{props.children}</Table>;
  };

  const TblHead = () => {
    return (
      <TableHead >
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell sx={{ fontWeight: '600'}} key={headCell.id}>{headCell.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  return {
    TblContainer,
    TblHead,
  };
}
