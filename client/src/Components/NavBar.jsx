import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import {Button} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import { NavLink,Link, useNavigate } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import color from '../styles'
import SearchBar from './SearchBar'
import FilterCategory from './FilterCategory'
import { Container } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { GETPRODUCTS,SEARCHBYCATEGORY,VERIFYADMIN } from '../actions';
import CartContext from '../Cart/CartContext'
import { AdminPanelSettings, ConfirmationNumberOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios'
import { Box, Divider, IconButton, ListItem, ListItemIcon, ListItemText,CardMedia } from "@mui/material"
import { useAuth0 } from "@auth0/auth0-react";
import { SEARCHBYNAMEPRODUCTS } from '../actions';
import {CartList} from '../Cart/CartList'
import Cookie from 'js-cookie'
import {api} from '../actions'
import WishList from './WishList'
import swal from 'sweetalert';

const logo=require('./3TECH.png')

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  // Override media queries injected by theme.mixins.toolbar
  '@media all': {
    minHeight: 30,
  },
}));


export default function PrimarySearchAppBar({wishlist,setWishList}) {

  const [isHovered, setIsHovered] = React.useState (false);

  const listaProductos = React.useMemo(()=>{
    return isHovered?
    <CartList/>
    : <></>

     
},[isHovered])
  

  const categories=useSelector((state)=>state.rootReducer.categories)
  const isAdmin=useSelector((state)=>state.rootReducer.isAdmin)
  const { numberOfItems,total,cart } = React.useContext( CartContext );
  const { user, isAuthenticated,getIdTokenClaims,logout,loginWithPopup } = useAuth0();
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [logged,setLogged]=React.useState(false)


  React.useEffect(()=>{
    dispatch(VERIFYADMIN())
  },[isAuthenticated])

  React.useEffect(()=>{
    if(!Cookie.get('cart'))Cookie.set('cart',JSON.stringify([]))
  },[])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 70,
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      {isAuthenticated&&<ListItem 
          button
          onClick={ () => navigate('/profile') }>
          <ListItemIcon>
             <AdminPanelSettings/>
          </ListItemIcon>
          <ListItemText primary={'Mi perfil'} />
        </ListItem>}

        {isAuthenticated&&<ListItem 
          button
          onClick={ () => navigate('/orderstable') }>
          <ListItemIcon>
            <ConfirmationNumberOutlined/>
          </ListItemIcon>
          <ListItemText primary={'Ordenes'} />
        </ListItem>}

        {((isAuthenticated)&&(!isAdmin))&&<ListItem 
          button
          onClick={ () => navigate('/user/reviews') }>
          <ListItemIcon>
           <StarIcon/> 
          </ListItemIcon>
          <ListItemText primary={'Calificación de compras'} />
        </ListItem>}


      {isAdmin&&<ListItem //SUBIR PRODUCTO
          button
          onClick={ () => navigate('/admin/uploadproduct') }>
          <ListItemIcon>
              <UploadIcon/> 
          </ListItemIcon>
          <ListItemText primary={'Publicar producto'} />
        </ListItem>}

      

      {isAdmin&&<ListItem   //DASHBOARD
          button
          onClick={ () => navigate('/admin/dashboard') }>
          <ListItemIcon>
              <DashboardOutlined />
          </ListItemIcon>
          <ListItemText primary={'Dashboard'} />
        </ListItem>}

        {isAuthenticated&&<ListItem //BOTON SALIR LOGOUT
          button
          onClick={ () => {
            Cookie.set('user',JSON.stringify([]))//pone en blanco al usuario n cookies
            Cookie.remove('cart')
            Cookie.remove('token')
            logout({ returnTo: window.location.origin })
          }}>
          <ListItemIcon>
              <VpnKeyOutlined/>
          </ListItemIcon>
          <ListItemText primary={'Salir'} />
        </ListItem>}

      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 65,
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>


      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
  <>
        
          <Container sx={{ flexGrow: 1, zIndex: 'tooltip'}} position="fixed" top='0px'>
            <AppBar sx={{bgcolor:color.color1}} >
              <StyledToolbar sx={{justifyContent:'space-between',alignItems:'center',height:30,mt:1}}>
                
                <Box>
                    <Link to='/'>
                      <CardMedia 
                        image={logo}
                        component='img'
                        sx={{width: 100, height: 80, objectFit:'contain'}}
                        onClick={()=>dispatch(GETPRODUCTS())}
                        />                          
                    </Link>
                </Box>

                <Box display={{xs:'none', sm:'flex'}} sx={{position:'absolute',top:10,left:'20vw',zIndex:1100}} flexDirection='row' alignItems='center'>
                  <CardMedia
                    image={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png"}
                    component='img'
                    sx={{width:40}}
                  />
                  <Typography variant='body2'>(U$D)</Typography>   
                </Box>



                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <SearchBar 
                  placeholder="Buscar por producto o categoria"
                  url='/'
                  dinamic={false}
                  action={SEARCHBYNAMEPRODUCTS}
                  />
                </Box>

      
              
                <Box sx={{display:'flex',alignItems:'center', justifyContent:'flex-end'}}>


                    {/* <IconButton style={{color: 'white'}}>
                      <FavoriteIcon>
                        
                      </FavoriteIcon>
                    </IconButton> */}
                    {isAuthenticated&&<WishList wishlist={wishlist} setWishList={setWishList}/>}
                    

                    <NavLink to='/cart' style={isActive => ({color: isActive ? "white" : "white"})}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={numberOfItems} color="error">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </NavLink>

                  <Box sx={{ display: { md: 'flex' } }}>
                    {isAuthenticated?
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar alt={user?.name} src={user?.avatar||user?.picture} />
                    </IconButton>
                    :
                    <Button sx={{bgcolor:color.color2,color:'black',ml:2}}
                    onClick={()=>loginWithPopup().then(()=>getIdTokenClaims()).then(r=>axios.post(`${api}/users/login`,{token:r.__raw})).then(r=>{
                      Cookie.set('token',r.data.token)
                      Cookie.set('user',JSON.stringify(r.data.user))
                      axios.post(`${api}/cart`,{
                        cart:JSON.parse( Cookie.get('cart') ),
                        totalPrice:total
                      },{
                        headers:{
                          'x-access-token':r.data.token
                        }
                      })
          
                    }).then(()=>{

                      const token= Cookie.get('token')
                      axios(`${api}/cart`,
                      {
                          headers:{
                              'x-access-token':token
                          }
                      }).then((r)=>{
                          Cookie.set('cart',JSON.stringify(r.data.cart))            
                      })

                    }).then(()=>{
                      dispatch(VERIFYADMIN())
                      let user=Cookie.get('user')&&JSON.parse(Cookie.get('user'))
                      if(user.suspendedAccount===true){
                        return swal({title:"Usuario Bloqueado",text:"Por favor contactarse con admin@mail.com",icon:"error",button:"Aceptar"})
                        .then(()=>{
                          Cookie.set('user',JSON.stringify([]))//pone en blanco al usuario n cookies
                          Cookie.remove('cart')
                          Cookie.remove('token')
                          logout({returnTo:window.location.origin})})
                      }
                     else window.location.reload()
                      })}>
                      Login
                    </Button>}
                  </Box>

                  {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                      size="large"
                      aria-label="show more"
                      aria-controls={mobileMenuId}
                      aria-haspopup="true"
                      onClick={handleMobileMenuOpen}
                      color="inherit"
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box> */}

                </Box>


                
              </StyledToolbar>

              <Divider sx={{bgcolor:color.color3,m:1}}/>

              <Box sx={{display:'flex',justifyContent:'center',mb:1,alignItems:'center'}}>
                <Typography variant='body2' sx={{mr:2}}>Categorias: </Typography>
                <FilterCategory/>
                <Divider orientation="vertical" flexItem sx={{display:{xs:'none',md:'flex'},bgcolor:'white',marginX:1}}/>
                    <Box sx={{display:{xs:'none',md:'flex'},flexDirection:'row'}}>
                      {categories.slice(0,4).map((e)=>(
                      <>
                          <Button onClick={()=>{dispatch(SEARCHBYCATEGORY(e._id)); navigate('/') }}>
                            <Typography variant='body2' sx={{color:'white',fontWeight:20}}>{e.name}</Typography>
                          </Button>
                        <Divider orientation="vertical" variant='middle'flexItem sx={{bgcolor:'white',marginX:1}}/>
                      </>               
                    ))}
                    </Box>
              </Box>

            </AppBar>
            {/* {renderMobileMenu} */}
            {renderMenu}
          </Container>
    </>
  );
}