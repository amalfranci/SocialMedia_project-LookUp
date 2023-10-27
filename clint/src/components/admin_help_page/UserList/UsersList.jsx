import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { blockUser, getUsersList } from '../../../utils';

export default function Userlist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await getUsersList();
    setRows(res.users);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 const handleBlockUser = async (userId) => {
  try {
    const action = "block"; // You can change this to "unblock" as needed

    const response = await blockUser(userId, action);


    if (response && response.user) {
  
      // Assuming your server returns the updated user data, you can update the local state accordingly
      const updatedRows = rows.map((row) =>
        row._id === userId ? { ...row, status: response.user.status } : row
      );
      setRows(updatedRows);
    } else {
      // Handle the case where the response is not successful
      console.error("Failed to block/unblock the user.");
    }
  } catch (error) {
    console.error(error.message);
  }
};


  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   
    
   
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ padding: "20px" }}
      >
        User's List
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Name
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Email
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Created At
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Profession
              </TableCell>
              <TableCell align="left" style={{ minWidth: "100px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row._id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">{row.firstName} {row.lastName}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{formatDate(row.createdAt)}</TableCell>
                    <TableCell align="left">{row?.profession}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleBlockUser(row._id)}
                      >
                        Block
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
