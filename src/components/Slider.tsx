import { Box, CircularProgress, Grid } from "@mui/material";
import React, {
  useState,
  PropsWithChildren,
  useRef,
  MouseEventHandler,
  useEffect,
} from "react";
import { Link, To } from "react-router-dom";
import { ColSize } from "../types/Types";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import useWindowSize from "../hooks/useWindowSize";
import { isMobile } from "react-device-detect";

export type SlideProps = {
  image: string;
  title?: string;
  subText?: string;
  link?: To;
  description?: string;
};

export type SliderProps = {
  maxStep?: number;
  slides: SlideProps[];
  slideOptions?: SlideOptions;
  changeDuration?: number;
  style?: React.CSSProperties;
};

type SlideOptions = {
  width?: number;
  columnSpacing?: number;
};

type SlidesProps = {
  slides: SlideProps[];
  slideOptions?: SlideOptions;
};

type TranslateX = {
  value: number;
  position: "left" | "center" | "right";
};

const Slides: React.FC<SlidesProps> = ({
  slides,
  slideOptions = { width: 250, columnSpacing: 20 },
}) => {
  const { width = 250, columnSpacing = 20 } = slideOptions;

  return (
    <>
      {slides.map(
        ({ title, subText, link = {}, image, description }, index) => {
          return (
            <div
              key={index}
              className="slide"
              style={{
                paddingLeft: index > 0 ? columnSpacing : 0,
                width: width,
              }}
            >
              <Link to={link} className="link">
                <div className="slide_inner">
                  <div className="slide_image_container">
                    <img src={image} alt={title} />
                  </div>
                  {(title || subText || description) && (
                    <div className="slide_body">
                      {(title || subText) && (
                        <div className="slide_body_head">
                          {title && <span className="title">{title}</span>}
                          {subText && (
                            <span className="subText">{subText}</span>
                          )}
                        </div>
                      )}
                      {description && (
                        <div className="slide_description">
                          <p className="slide_description_text">
                            {description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        }
      )}
    </>
  );
};

export const Slider: React.FC<SliderProps> = ({
  slides,
  maxStep = 3,
  slideOptions = { width: 250, columnSpacing: 20 },
  changeDuration = 1,
  style,
}) => {
  const containerRef = useRef<any>(null);
  const innerRef=useRef<any>(null);
  const [arrowHover, setArrowHover] = useState("");
  const [arrowLeft, setArrowLeft] = useState(false);
  const [arrowRight, setArrowRight] = useState(true);
  const [translateX, setTranslateX] = useState<TranslateX>({
    value: 0,
    position: "left",
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const [innerWidth,setInnerWidth]=useState(0);
  const [screenSize, setScreenSize] = useWindowSize();
  const [isSlidable,setIsSlidable]=useState(true);

  useEffect(() => {
    const newContainerWidth=containerRef.current ? containerRef.current.offsetWidth : 0;
    const newInnerWidth=innerRef.current ? innerRef.current.offsetWidth : 0;

    setContainerWidth(
      containerRef.current ? containerRef.current.offsetWidth : 0
    );
    setInnerWidth(
        innerRef.current ? innerRef.current.offsetWidth : 0
    );

    setIsSlidable(newInnerWidth>newContainerWidth);
  }, [containerRef.current, screenSize,slides]);

  const arrowClickHandler = (direction: "right" | "left") => {
    const { width = 250, columnSpacing = 20 } = slideOptions;

    let newX =
      translateX.value +
      ((width || 250) + columnSpacing) *
        maxStep *
        (direction === "left" ? 1 : -1);
    newX =
      ((width || 250) + columnSpacing) *
      Math.round(newX / ((width || 250) + columnSpacing));
    newX = newX - columnSpacing * (newX > 0 ? 1 : newX < 0 ? -1 : 0);

    const right =
      ((slides.length + 2) * (width || 250) - columnSpacing) * -1 +
      containerWidth;

    if (
      direction === "right"
        ? newX < right + width * 2 + columnSpacing * 2
        : newX > width * -2 - columnSpacing
    )
      newX = 0;

    if (
      newX >= 0 ||
      newX - width / 4 <=
        (slides.length * ((width || 250) + columnSpacing) - containerWidth) * -1
    ) {
      setTranslateX((prev) => {
        return { value: direction === "left" ? 0 : right, position: direction };
      });
      if (direction === "left") {
        setArrowLeft(false);
        setArrowRight(true);
      } else {
        setArrowRight(false);
        setArrowLeft(true);
      }
      setArrowHover("");
    } else {
      setArrowRight(true);
      setArrowLeft(true);
      setTranslateX({ position: "center", value: newX });
    }
  };

  if (slides.length === 0) {
    return (
      <Box className="preload">
        <CircularProgress color="error" />
      </Box>
    );
  }

  return (
    <div
      className={`slider ${
        slides[0].description && !isMobile ? "slide_with_text" : ""
      } ${isMobile ? "slider_mobile" : ""}`}
      style={style}
    >
      <div
        className="slider_container"
        style={{
          overflowX: isMobile ? "auto" : "visible",
          margin: isMobile ? "0px" : "24px",
        }}
        ref={containerRef}
      >
        <div
          className={`slider_inner ${arrowHover}`}
          ref={innerRef}
          style={{
            transition: `transform ${changeDuration}s ease,left 0.3s ease-in-out`,
            transform: `translateX(${
              translateX.position === "center"
                ? translateX.value + "px"
                : translateX.position === "left" || !isSlidable
                ? "0px"
                : `calc(100% * -1 + ${containerWidth}px)`
            })`,
          }}
        >
          <Slides slides={slides} slideOptions={slideOptions} />
        </div>
        {(!isMobile && isSlidable) && (
          <>
            <div
              className={`arrow left ${arrowLeft ? "active" : "inactive"}`}
              onMouseEnter={() => {
                setArrowHover(arrowLeft ? "on_arrow_left" : "");
              }}
              onMouseLeave={() => {
                setArrowHover("");
              }}
              onClick={() => arrowClickHandler("left")}
            >
              <div className="arrow_inner">
                <KeyboardArrowLeftIcon fontSize="large" className="arrow_svg" />
              </div>
            </div>
            <div
              className={`arrow right ${arrowRight ? "active" : "inactive"}`}
              onMouseEnter={() => {
                setArrowHover(arrowRight ? "on_arrow_right" : "");
              }}
              onMouseLeave={() => {
                setArrowHover("");
              }}
              onClick={() => arrowClickHandler("right")}
            >
              <div className="arrow_inner">
                <KeyboardArrowRightIcon
                  fontSize="large"
                  className="arrow_svg"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
