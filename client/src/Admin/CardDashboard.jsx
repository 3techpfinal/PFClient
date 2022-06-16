import { FC } from 'react';

import { Grid, Card, CardContent, Typography,Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useState, useEffect,useMemo } from "react";




export default function SummaryTile ({ title, subTitle, icon,link})  {


    const [isHovered, setIsHovered] = useState (false);
/*
    const productImage = useMemo(()=>{
        return title?isHovered?
          `${product.imageProduct[1]}`
        : `${product.imageProduct[0]}`
        : `${product.imageProduct[0]}`
         
    },[isHovered,product.imageProduct])

*/

  return (
    
    <Grid  item xs={12} sm={4} md={3}>
          
          {link!==undefined?
            <NavLink to={`/${link}`}> 
                <Card sx={{ display: 'flex', height:'200' }}>
                    <CardContent sx={{ width: 50, display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} /> */}
                        { icon }
                    </CardContent>
                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h3'>{ title }</Typography>
                        <Typography variant='caption'>{ subTitle }</Typography>
                    </CardContent> 
                </Card>
            </NavLink>
            :
            <Card  sx={{ display: 'flex' }}>
                <CardContent sx={{ width: 50, display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                    { icon }
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h3'>{ title }</Typography>
                    <Typography variant='caption'>{ subTitle }</Typography>
                </CardContent> 
            </Card>       
          } 
        
    </Grid>

   
  )
}
