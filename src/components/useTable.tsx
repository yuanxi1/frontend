import {

  Table,
  TableCell,
  TableHead,
  TableRow,


} from "@mui/material";
import TableContainer from '@mui/material/TableContainer';



export default function useTable(
  headCells: {
    id: string;
    label: string;
  }[]
) {
  

  const TblContainer = (props: any) => {
    ///???
    return <Table stickyHeader sx={{ width: '100%', maxWidth:'320'}}>{props.children}</Table>;
  };

  const TblHead = (props: any) => {
    ///???
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
