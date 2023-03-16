import { Box, CircularProgress, Container, Grid } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { isMobile } from "react-device-detect";
import { Link, To } from "react-router-dom";
import { ColSize } from "../types/Types";



export type CardProps={
    image:string;
    title?:string;
    subText?:string;
    col?:ColSize;
    link?:To;
    height?:ColSize;
}

export type CardsProps={
    cards:CardProps[];
    spacing?:number|string;
    cardsCol?:ColSize;
    cardsHeight?:ColSize;
    moreButton?:{
        text:string;
        action:string|(()=>void);
    }|null;
}


export const Card: React.FC<CardProps>=({col,image,title,subText,link={},height={xs:350}})=>{
    return(
        <Grid item {...col} minHeight={height} className='card'>
            <Link to={link} className='link'>
                <div className='card_inner'>
                    <div className="image_container">
                        <img src={image} alt={title} />
                    </div>
                    { (title||subText) &&
                        <div className="body">
                            {title &&
                                <span className="title">{title}</span>
                            }
                            {subText &&
                                <span className="subText">{subText}</span>
                            }
                        </div>
                    }
                </div>
            </Link>
        </Grid>
    )
}


const Cards: React.FC<CardsProps> = ({cards,spacing=0,cardsCol,cardsHeight,moreButton}) => {


    const [isCardsLoading,setIsCardsLoading]=useState<boolean>(false);

    useEffect(()=>{
        setIsCardsLoading(false);
    },[cards])

    if(cards.length===0){
        return(
            <Box className='preload' marginTop={"0px"}><CircularProgress color='error'/></Box>
        )
    }

    return (
      <Box className='cards'>
            <Grid container spacing={spacing} className='cards_inner'>
                {cards.map((card,i)=>{return(
                    <Card key={i} col={cardsCol} height={cardsHeight} {...card}/>
                )})}
            </Grid>
            { moreButton &&
                <div className="more_container">
                    { isCardsLoading ?
                        <Box className="preload">
                            <CircularProgress color="error" />
                        </Box>
                    :   typeof moreButton.action === 'string'
                        ? <Link to={moreButton.action}><span>{moreButton.text}</span></Link>
                        : <Link to={{}} onClick={(e)=>{
                            e.preventDefault();
                            setIsCardsLoading(true);
                            if(typeof moreButton.action!=='string'){
                                moreButton.action();
                            }
                        }}><span>{moreButton.text}</span></Link>
                    }
                </div>
            }
      </Box>
    );
  };

  export default Cards;