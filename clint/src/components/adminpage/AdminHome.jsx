import React, { useEffect, useState } from "react";
import Sidenav from "../admin_help_page/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../admin_help_page/navbar/Navbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { apiRequest } from "../../utils";

export function AdminHome() {

  const [count, setCount] = useState('')
   useEffect(() => {
    async function fetchUserCount() {
      try {
    const usersCount = await apiRequest({
      url: "/admin/user-count",
      method: "GET",
    });
    
       
    setCount(usersCount.count)
    return  usersCount;
  } catch (error) {
    console.error(error.message);
  }
    }

    fetchUserCount();
   }, []);
 
    
  return (
    <>
      <Navbar />
      <Box height={70} />

      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Stack spacing={2} direction="row">
                <Card sx={{ maxWidth: 49 + "%", height: 140 }}></Card>
                <Card sx={{ maxWidth: 49 + "%", height: 140 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Total Members
                    </Typography>
<Typography
  variant="body2"
  color="text.secondary"
  sx={{ fontSize: '24px', textAlign: 'center' }}
>
  {count}
</Typography>

                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={2}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                    ></Typography>
                  </CardContent>
                </Card>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                    ></Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
          <Box height={20} />
          <Grid container spacing={2}>
            <Grid item xs={8}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}
