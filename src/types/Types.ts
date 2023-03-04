import { GridSize } from "@mui/system";
import { To } from "react-router-dom";

export type Comic={
    imageUrl:string;
    id:number;
    title:string;
    date:string;
    link?:To;
}
  
export type Character={
    imageUrl:string;
    id:number;
    name:string;
    link?:To;
}

export type Series={
    imageUrl:string;
    id:number;
    title:string;
    link?:To;
    startYear?:number;
    endYear?:number;
}

export type Creator={
    imageUrl:string;
    id:number;
    fullName:string;
    firstName:string;
    lastName:string;
    middleName:string;
    link?:To;
}

export type MarvelEvent={
    imageUrl:string;
    id:number;
    title:string;
    start?:string;
    end?:string;
    description?:string;
    link?:To;
}

export type MarvelTypes=Comic|Character|Series|Creator|MarvelEvent;

export type ColSize={
    xs?:GridSize;
    sm?:GridSize;
    md?:GridSize;
    lg?:GridSize;
    xl?:GridSize;
}

export type MarvelCharactersOrderBy='name'|'modified'|'-name'|'-modified';
export type MarvelCreatorsOrderBy='firstName'|'-firstName'| 'modified'|'-modified' | '-lastName' | 'lastName' | 'middleName' | '-middleName' | '-suffix' | 'suffix';
export type MarvelSeriesOrderBy='title'|'modified'|'-title'|'-modified' | 'startYear' | '-startYear';
export type MarvelEventsOrderBy='name'|'modified'|'-name'|'-modified' | 'startDate' | '-startDate';
export type MarvelComicsOrderBy='title'|'modified'|'-title'|'-modified' | 'focDate' | '-focDate' | 'onsaleDate' | '-onsaleDate' | 'issueNumber'|'-issueNumber';


export type MarvelAPIOptions={
    limit?:number;
    offset?:number;
    need?:number;
  }

