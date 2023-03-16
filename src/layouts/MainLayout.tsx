import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import { Container } from '@mui/material';
import Search from '../components/SearchComponent';
import '../scss/components/_mainLayout.scss'
import useCurrentLocation from '../hooks/useCurrentLocation';
import ListenHtmlEvent from '../Utils/ListenHtmlEvent';


const locations=[
  {
    includes:'comics',
    getColor:(path:string)=>{
      return path.split('/').length>2 ? 'rgb(32, 32, 32)':'white';
    }
  },
  {
    includes:'series',
    getColor:(path:string)=>{
      return path.split('/').length>2 ? 'rgb(32, 32, 32)':'white';
    }
  }
];


const MainLayout: React.FC = () => {
  const location = useLocation();
  const backgroundColor=locations.find((loc)=>location.pathname.includes(loc.includes))?.getColor(location.pathname)||'white';

  useEffect(()=>{
    const listenBeforeUnload=ListenHtmlEvent(window,'beforeunload',() => {
      sessionStorage.clear();
    })

    return ()=>{
      listenBeforeUnload.removeListener();
    }
  },[])

  return (
    <div className="wrapper" style={{backgroundColor,minWidth:'350px'}}>
        <Header />
        <Container className="container" disableGutters={true} style={{marginTop:'80px'}}>
          <div className="content" style={{paddingTop:0}}>
              <Outlet />
          </div>
        </Container>
        <footer className='footer'>
          <Container className='footer_container' disableGutters={true}>
            
          </Container>
        </footer>
    </div>
  );
};

export default MainLayout;
