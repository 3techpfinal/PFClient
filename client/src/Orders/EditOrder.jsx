import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { CartList, OrderSummary } from '../Cart';
import NavBar from '../Components/NavBar'
import {useContext,useEffect,useState} from 'react'
import CartContext from '../Cart/CartContext'
import Cookie from 'js-cookie';
import axios from 'axios';
import {api} from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/500.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import swal from 'sweetalert'

import {EDITORDER, GETORDER} from '../actions'

export default function SummaryPage(){ // esta es la funcion principal
    
    
    const [inputOrder,setInputOrder]=useState({})
    const navigate = useNavigate()    
    const dispatch= useDispatch();

    const {id}=useParams()

    const order=useSelector((state)=>state.rootReducer.order)
     let input = {products:"", adress: "", isPaid: false, totalPrice: order?.totalPrice }
    
     useEffect(()=>{
        dispatch(GETORDER(id))
    },[dispatch])

    // useEffect(()=>{setInputOrder({
    //     /*order.products.map((product)=>{(
    //         _id:order._id,
    //         price:order.totalPrice
    //         products:                                                               
    //     })*/

    // })},[order]
    // )





    const editarOrden = async ()=> {
       // if(user.adress&&user.city&&user.phone){
            let ordenNueva = await dispatch(EDITORDER(order))
            dispatch(GETORDER(ordenNueva.payload)).then(()=> // me voy al resumen a ver si pago o no
            navigate(`/ordersummary/${ordenNueva.payload}`))
            //removeAllCartProduct()
      //  }
        //else{
            // swal({
            //     title: "Por favor complete sus datos de entrega para realizar la compra",
            //     text: "",
            //     icon: "warning",
            //     buttons: ["Cancelar","Ir a mi perfil"]
            //   }).then((go) => {
            //     if (go)navigate('/profile')
            //   })
            
        //}
    }

    return(
           <>
        <NavBar/>
        <Typography variant='h4'  sx={{mt:15,fontWeight:20}} display='flex' justifyContent='center'> Editar la orden</Typography>
        <Divider sx={{m:1,marginX:'10%'}}/>
            <Grid container sx={{mt:3}}>
                <Grid item xs={12} sm={7}>

                     <CartList editable={false}/>  {/*COMPONENTE LISTA DEL CARRITO */}

                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h4' sx={{fontWeigth:20}}>Resumen</Typography>
                            <Divider sx={{my:1}}/>
                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'> Datos para la entrega:</Typography>
                                    <Button onClick={()=>navigate('/profile')}>
                                        Editar
                                    </Button>
                            </Box>

                            
                            {order.user?.adress&&order.user?.city&&order.user?.phone?
                            <Box>
                                <Typography>{order.user?.name}</Typography>
                                <Typography>{order.user?.adress}</Typography>
                                <Typography>{order.user?.city}</Typography>
                                <Typography>{order.user?.phone}</Typography>
                            </Box>
                            :
                            <Box sx={{display:'flex',justifyContent:'center'}}>
                                <InfoOutlinedIcon color='error'/>
                                <Typography>Por favor completar sus datos para poder realizar la compra</Typography>
                            </Box>}

                            <Divider sx={{my:1}}/>

                            <Box display='flex' justifyContent='end'>
                                
                                <Link to="/cart">
                                    Editar
                                </Link>
                            </Box>

                            <OrderSummary/>

                            <Box sx={{mt:3}} >
            
                                    <Button color='secondary' className='circular-btn' fullWidth onClick={()=>editarOrden()}>
                                        Editar Orden
                                    </Button>                    

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
               
            </Grid>

            </>
    )
}
