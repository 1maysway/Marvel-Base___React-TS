import { CircularProgress } from "@mui/material";
import React from "react";

type PreloaderProps={
  style?: React.CSSProperties;
  circularProgressColor?:"error" | "primary" | "secondary" | "info" | "success" | "warning" | "inherit";
}

const Preloader:React.FC<PreloaderProps> = ({style,circularProgressColor='error'}) => {
  console.log(style);
  
  return (
    <div className="preloader" style={style}>
      <CircularProgress color={circularProgressColor} />
    </div>
  );
};

export default Preloader;
