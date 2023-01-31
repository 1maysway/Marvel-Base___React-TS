import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Header from '../components/Header';
import { Box, CircularProgress, Container } from '@mui/material';
import Search from '../components/Search';
import {Comic,Character} from '../types/Types'

import '../scss/pages/_all.scss'
import Carousel from '../components/Carousel';
import axios from 'axios';
import { log } from 'console';
import Cards from '../components/Cards';
import { Slider } from '../components/Slider';


const Main: React.FC = () => {


  const [characters,setCharacters]=useState<Character[]>([]);
  const [comics,setComics]=useState<Comic[]>([]);

  const fetchData = async () => {
    // fetch Characters
    const charactersResponse = await axios.get('https://gateway.marvel.com/v1/public/characters?apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363').then(res=>res.data.data.results)
    let charactersMaped=charactersResponse.map((char:any)=>{
      return {imageUrl:char.thumbnail.path+'.'+char.thumbnail.extension,id:char.id,name:char.name} as Character})
    let charactersFiltered=charactersMaped.filter((char:Character)=>!char.imageUrl.includes('image_not_available'))
    setCharacters(charactersFiltered);

    // fetch Comics
    const comicsResponse = await axios.get('https://gateway.marvel.com/v1/public/comics?apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363').then(res=>res.data.data.results)
    
    let comicsMaped=comicsResponse.map((comic:any)=>{
      let date = comic.dates.find((date:any)=>date.type==="onsaleDate").date.substring(0,10).split('-')[0]
      return {imageUrl:comic.thumbnail.path+'.'+comic.thumbnail.extension,id:comic.id,title:comic.title, date:date} as Comic})
    let comicsFiltered=comicsMaped.filter((comic:Comic)=>!comic.imageUrl.includes('image_not_available'))
    setComics(comicsFiltered);
  }
  
  useEffect(()=>{
    fetchData();
  },[])
  

  const comicsForSlider=comics.map(({imageUrl,title,date})=>{
    return {image:imageUrl,title,subText:date}
  })

  return (
    <div id='main_page'>
        <Grid container>
          {characters.length>0 
              ? <Grid id='main_page_first_banner' item xs={12} display='flex' justifyContent='center' alignItems='center' sx={{overflow:'hidden'}}>
                  <Carousel slides={characters.map(character=>character.imageUrl)} columnSpacing={20} text={{
                    header:{text:'MARVEL BASE',fontSize:'48px'},
                    subText:{text:'The marvel company',fontSize:'24px'},
                    color:'white', 
                    background:{color:'rgba(32, 32, 32,0.5)'},
                    width:'50%',
                    bottom:'80px',
                    padding:'30px'
                    }} rotate={-10} duration={60}/>
                </Grid>
              : <Grid id='main_page_first_banner' item xs={12} display='flex' justifyContent='center' alignItems='center'><CircularProgress color='error'/></Grid>
          }
          {comics.length>0
              ? <Grid id='main_page_rec_comics' item xs={12} marginTop='80px' height='550px' justifyContent='center' alignItems='center' display='flex'>
                  <Slider slides={comicsForSlider} slideOptions={{width:250}} maxStep={3}/>
                </Grid>
              : <Grid id='main_page_rec_comics' item xs={12} marginTop='80px' height='auto' display='flex' justifyContent='center' alignItems='center'><CircularProgress color='error'/></Grid>
          }
        </Grid>
    </div>
  );
};

export default Main;
