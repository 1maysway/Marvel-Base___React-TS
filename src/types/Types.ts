import { GridSize } from "@mui/system";

export type Comic={
    imageUrl:string;
    id:number;
    title:string;
    date:string;
}
  
export type Character={
    imageUrl:string;
    id:number;
    name:string;
    
}
export type ColSize={
    xs?:GridSize;
    sm?:GridSize;
    md?:GridSize;
    lg?:GridSize;
    xl?:GridSize;
}