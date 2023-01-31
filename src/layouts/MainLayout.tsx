import React from 'react';
import { Outlet } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import { Container } from '@mui/material';
import Search from '../components/Search';
import '../scss/components/_mainLayout.scss'


const MainLayout: React.FC = () => {
  return (
    <div className="wrapper" style={{backgroundColor:'rgb(237, 238, 240)', paddingBottom:400}}>

        <Header />
        <Container className="container" maxWidth='lg' disableGutters={true}>
          <div className="content" style={{paddingTop:0}}>
              <Outlet />
          </div>
        </Container>
    </div>
  );
};

export default MainLayout;
