import { Box, Button, Container, createTheme, Divider, Drawer, FormControl, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, TextField } from "@mui/material";
import { useState } from "react";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Search from "./Search";
import Link from '@mui/material/Link';


const Header: React.FC = () => {

    const [menuOpened, setMenuOpened]=useState(false)

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
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      );

    const anchor='top';
  
    return (
      <div className="header">
        <Container className="container" disableGutters={true}>
            <Grid container columnSpacing={4} height='100%' justifyContent={{xs:'space-between',md:'start'}}>
                <Grid className="logo_grid_item" item xs={12} md={'auto'}>
                        <Link href='/' underline="none">
                                <h1 className="logo_text">MARVEL BASE</h1>
                        </Link>
                </Grid>
                <Grid item display={{md:"flex",xs:"none"}} alignItems='center' justifyContent='center'>
                        <Grid className="grid_item" container columnSpacing={3} height='100%' alignItems='center' justifyContent='end'>
                            <Grid className="grid_item" item xs={'auto'}>
                                <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        CHARACTERS
                                    </Link>
                                </div>
                            </Grid>
                            <Grid className="grid_item" item xs={'auto'}>
                            <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        COMICS
                                    </Link>
                                </div>
                            </Grid>
                            <Grid className="grid_item" item xs={'auto'}>
                            <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        NEWS
                                    </Link>
                                </div>
                            </Grid>
                            <Grid className="grid_item" item xs={'auto'}>
                            <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        MOVIES
                                    </Link>
                                </div>
                            </Grid>
                            <Grid className="grid_item" item xs={'auto'}>
                            <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        TV SHOWS
                                    </Link>
                                </div>
                            </Grid>
                            <Grid className="grid_item" item xs={'auto'}>
                            <div className="grid_item_inner">
                                    <Link href='/' style={{ textDecoration: 'none' }}>
                                        GAMES
                                    </Link>
                                </div>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid className="" item xs={12} md={'auto'} display={{xs:"flex",md:"none"}} alignItems='center' justifyContent='end'>
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
        </Container>
      </div>
    );
  };

  export default Header;