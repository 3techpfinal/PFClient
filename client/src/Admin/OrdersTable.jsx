
import { useEffect, useState} from 'react';
import { DataGrid,} from '@mui/x-data-grid';
import { Grid, Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {GETORDERS,SEARCHORDERS,GETORDER,DELETEORDER} from '../actions'
import NavBar from '../Components/NavBar'
import SearchBar from '../Components/SearchBar'
import { Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert'


const useAppDispatch = () => useDispatch();

const UsersPage = () => {
    
    const dispatch=useAppDispatch()
    useEffect(()=>{
        dispatch(GETORDERS())
      },[dispatch])
      
      
    const calcularCantidaddeProductosTotalesEnOrden = (order) =>{
        let contador = 0
        order.products.map((product)=>(
            contador = contador + product.quantity
        ))
        return contador      
    }

    const orders=useSelector((State) => State.rootReducer.orders);
    const [rows,setRows]=useState([])

    useEffect(()=>{ //una vez que llegan las ordenes se llenana las rows
        setRows(()=>orders.map( (order) => ({
            id:order._id,
            name: order?.user?.name || "no hay nombres",
            email: order?.user?.email || "no hay nombres",
            orderNumber: order?._id || "no hay orden",
            amountOfProducts: order?.products.length || "",
            amountOfProductsTotal: calcularCantidaddeProductosTotalesEnOrden(order),
            totalPrice: `${'$'+ new Intl.NumberFormat().format(order?.totalPrice)}` || "sin precio",
            isPaid: order.isPaid
        })))
    },[orders])


    const navigate= useNavigate()

      const verOrden=async (id)=>{
        dispatch(GETORDER(id)).then(()=>navigate(`/orderpayment/${id}`))
    }

    const deleteOrder=async(row)=>{
        swal({
            title: "Estas seguro que deseas eliminar la orden?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {

             dispatch (DELETEORDER(row.id)).then((r)=>{
                 if(r.payload.message==='Order successfully deleted'){
                    setRows((state)=>state.filter(e=>
                        e.id!==row.id
                    ))
                    //   swal("has eliminado la orden!", { icon: "success",});
                 }
             })
     
            } else {
            }
          });
    }





    const columns = [
        { field: 'name', headerName: 'Usuario', width: 250 },
        { field: 'email', headerName: 'email', width: 250 },
        { field: 'orderNumber', headerName: 'Nº de Orden', width: 250 },
        { field: 'amountOfProducts', headerName: 'Cantidad de productos \n de un tipo', width: 280 },
        { field: 'amountOfProductsTotal', headerName: 'Cantidad de productos totales', width: 280 },
        { field: 'totalPrice', headerName: 'Precio total', width: 150 },
        {
            field: 'isPaid',
            width: 150,
            headerName: 'Estado',
            renderCell: ({ row }) => {
                return row.isPaid
                    ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                    : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
            }
        },
        {
            field:'orden',
            headerName:'Ver orden',
            width: 200,
            sortable: false,
            renderCell: (params)=>{
                return (
                
                        // <NavLink to={`/order/${params.row.id}`}>
                        //     <Link underline='always'>
                                <Button onClick={()=>verOrden(params.row.id)}>
                                     Ver Orden
                                </Button>
                        //     </Link>
                        // </NavLink>

                        )
                
            }
         },

         {
            field:'delete',
            headerName:'eliminar',
            width: 200,
            sortable: false,
            renderCell: (params)=>{
                return (
                        params.row?.isPaid?
                        <Button fullWidth sx={{color:'gray', backgroundColor:'gray'}}></Button> :
                        <Button  onClick={(e)=> deleteOrder(params.row) }>
                            eliminar
                        </Button>
                        )
                
            }
         }


    ];



    




  return (
    <>

    <NavBar/>
    <Box mt={15} >

    <Typography variant='h2'>Ordenes</Typography>

    <SearchBar 
                placeholder="Buscar por nombre de producto o usuario"
                url='/orderstable'
                dinamic={true}
                action={SEARCHORDERS}
        />

        


   
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height:650, width: 40000 }}>
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 20 }
                        rowsPerPageOptions={ [30] }
                    />

                </Grid>
            </Grid>


        </Box>
    </>
  )
}

export default UsersPage