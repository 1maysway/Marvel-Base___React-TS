import { Box, Container, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";


const Header: React.FC = () => {

    const [menuOpened, setMenuOpened]=useState(false);
    const anchor='top';
    const buttons=[
      {text:'CHARACTERS',link:'/search/?type=characters'},
      {text:'SERIES',link:'/search/?type=series'},
      {text:'COMICS',link:'/search/?type=comics'},
      {text:'CREACTORS',link:'/search/?type=creators'},
      {text:'EVENTS',link:'/search/?type=events'},
    ];

    const menuButtonHandler=(open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setMenuOpened(open)
    }

    const list = (anchor: string) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={menuButtonHandler(false)}
          onKeyDown={menuButtonHandler(false)}
        >
          <List className="burgerList">
            {buttons.map(({text,link={}}, index) => (
              <ListItem key={text} disablePadding>
                <Link to={link} style={{width:'100%',textDecoration:'none'}}>
                  <ListItemText primary={text} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      );

    
  
    return (
      <div className="header">
        <Container className="container" disableGutters={true}>
            <Grid container columnSpacing={4} height='100%' justifyContent={{xs:'space-between',md:'start'}} flexDirection={{xs:'row-reverse',md:'row'}} >
                <Grid className="logo_grid_item" item xs={12} md={'auto'}>
                        <Link to={'/'}>
                                <h1 className="logo_text">MARVEL BASE</h1>
                        </Link>
                </Grid>
                <Grid item  alignItems='center' justifyContent='center' xs={6} md >
                        <Grid container justifyContent={{xs:'end',md:'space-between'}} display='flex' height={'100%'} paddingX={{xs:"12px",md:0}}>
                          <Grid item xs={'auto'} display={{md:"flex",xs:"none"}}>
                            <Grid className="grid_item" container columnSpacing={3} alignItems='center' justifyContent='end'>
                              {
                                buttons.map(({text,link={}})=>{
                                  return(
                                    <Grid key={text} className="grid_item" item xs={'auto'}>
                                      <div className="grid_item_inner">
                                          <Link to={link} style={{ textDecoration: 'none' }}>
                                              {text}
                                          </Link>
                                      </div>
                                  </Grid>
                                  )
                                })
                              }
                            </Grid>
                          </Grid>
                          <Grid item xs={'auto'}>
                            <Grid container justifyContent={'end'} height={'100%'}>
                              <Grid className="grid_item" item xs>
                                <div className="grid_item_search">
                                  <Link to={'/search'} style={{ textDecoration: 'none' }}>
                                    <SearchIcon fontSize="medium"/>
                                  </Link>
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                </Grid>
                <Grid  className="" item xs={6} md={'auto'} display={{xs:"flex",md:"none"}} alignItems='center' >
                    <Grid container justifyContent={{xs:'start',md:'end'}} paddingX={{xs:"12px",md:0}}>
                      <IconButton onClick={menuButtonHandler(true)} style={{marginRight:10}}><MenuIcon fontSize="large" style={{color:"ffffff"}}/></IconButton>
                      <Drawer
                          anchor={anchor}
                              open={menuOpened}
                              onClose={menuButtonHandler(false)}
                          >
                          {list(anchor)}
                      </Drawer>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
      </div>
    );
  };

  export default Header;