import { Grid } from "@mui/material";
import React from "react";
import { Link, To } from "react-router-dom";
import { ColSize } from "../types/Types";



type CardProps={
    image:string;
    title?:string;
    subText?:string;
    col?:ColSize;
    link?:To;
    height?:ColSize;
}

type CardsProps={
    cards:CardProps[];
    spacing?:number;
    cardsCol?:ColSize;
    cardsHeight?:ColSize;
}


export const Card: React.FC<CardProps>=({col,image,title,subText,link={},height={xs:350}})=>{
    console.log(height);
    
    //height={height}
    return(
        <Grid item {...col}  className='card'>
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


const Cards: React.FC<CardsProps> = ({cards,spacing=0,cardsCol,cardsHeight}) => {
    return (
      <Grid container spacing={spacing} className='cards' overflow='hidden' direction='row' wrap="nowrap">
        {cards.map((card,i)=>{return(
            <Card key={i} col={cardsCol} height={cardsHeight} {...card}/>
        )})}
      </Grid>
    );
  };

  export default Cards;