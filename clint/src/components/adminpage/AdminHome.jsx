import React from 'react'
import Sidenav from '../admin_help_page/Sidenav'
import Box from '@mui/material/Box';
import Navbar from '../admin_help_page/navbar/Navbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';





 export function AdminHome() {
  return (
    <>
      <Navbar />
       <Box height={70}/>
      
      <Box sx={{ display: 'flex' }}>
      
           <Sidenav />
      
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Stack spacing={2} direction="row">
               <Card sx={{ maxWidth: 49 +"%",height:140 }}>
     
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
   
              </Card>
                         <Card sx={{ maxWidth: 49 +"%",height:140 }}>
     
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
   
                </Card>
                </Stack>
          
        </Grid>
            <Grid item xs={4}>
              <Stack spacing={2} >

                <Card sx={{ maxWidth: 345 }}>
     
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
   
      </CardContent>
   
                </Card>
                 <Card sx={{ maxWidth: 345 }}>
     
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
   
      </CardContent>
   
                </Card>
                
                </Stack>
              
          
        </Grid>
       
          </Grid>
              <Box height={20}/>
             <Grid container spacing={2}>
        <Grid item xs={8}>
          
        </Grid>
        <Grid item xs={4}>
          
        </Grid>
       
      </Grid>
      
          
      
        
      </Box>
   </Box>
   
    </>
  )
}



 