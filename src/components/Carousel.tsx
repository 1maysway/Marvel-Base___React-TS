
import React, {useState, useEffect, useRef, Ref, TransitionEventHandler, FC} from 'react';
import useWindowSize from '../hooks/useWindowSize';

interface ICarouselInner{
    left:number;
    translateX:number;
}
type CarouselInner=ICarouselInner;

type CarouselProps={
    slideWidth?:number;
    slides:string[];
    duration?:number;
    columnSpacing?:number;
    text?:{
        header?:{
            text:string;
            fontSize?:string|number;
        }
        subText?:{
            text:string;
            fontSize?:string|number;
        }
        color?:string;
        background?:{
            color?:string;
        }
        padding?:string;
        width?:string;
        left?:string;
        bottom?:string;
    };
    rotate?:number|string;
}

type SlidesProps={
    slides:string[];
}

const Carousel:FC<CarouselProps> = ({slideWidth=350,slides,duration=30,columnSpacing=0,text,rotate}) => {
    const rotateSplit=typeof(rotate)==='string'?parseInt(rotate):rotate;
    const text_header_fontSize=text?.header?.fontSize? typeof(text?.header?.fontSize)==='string'?text?.header?.fontSize:text?.header?.fontSize+'px':'32px'
    const text_sub_fontSize=text?.subText?.fontSize? typeof(text?.subText?.fontSize)==='string'?text?.subText?.fontSize:text?.subText?.fontSize+'px':'16px'
    const [translatePxs,setTranslatePxs]=useState(1200);
    const innerRef=useRef<HTMLDivElement>(null);
    const [screenSize,setScreenSize]=useWindowSize();
    const [carouselInner,setCarouselInner]=useState<CarouselInner>({
        left:0,
        translateX:slides.length*(slideWidth+columnSpacing)*-1
    })
    const innerOnTransitionEnd=(e:React.TransitionEvent<HTMLDivElement>)=>{
        setCarouselInner(prev=>({...prev,translateX:prev.translateX-slides.length*(slideWidth+columnSpacing),left:prev.left+slides.length*(slideWidth+columnSpacing)}))
    }

    useEffect(()=>{
        setTimeout(()=>{
            if(innerRef.current){
                innerRef.current.style.transform=`translateX(${carouselInner.translateX}px)`;
            }
        },10)
    },[])

    const SlidesComponent:FC<SlidesProps>=({slides})=>{
        return(
            <>
                {slides.map((imageUrl,i)=>{
                    return (
                        <div className='slide' key={i} style={{width:`${slideWidth}px`,paddingRight:`${columnSpacing}px`}}>
                            <img src={imageUrl} />
                        </div>
                    )
                })}
            </>
        )
    }
  return (
    <div className='container'>
        <div className='carousel' style={{
            transform:rotate?`rotate(${Number.isInteger(rotate)?rotate+'deg':rotate})`:'',
            width:rotate?'120%':'100%',
            height:rotateSplit?`${100+(rotateSplit*4*(rotateSplit<0?-1:1))}%`:'100%'}}>
            <div className='carousel_inner' style={{
                    transition:`transform ${duration}s linear`,
                    transform:`translateX(${carouselInner.left===0?0:carouselInner.translateX}px)`, 
                    left:carouselInner.left
                }}
                ref={innerRef}
                onTransitionEnd={innerOnTransitionEnd}
            >
                <SlidesComponent slides={slides}/>
                <SlidesComponent slides={slides}/>
            </div>
        </div>
        {text && <div className='text' style={{
            color:text.color||'white',
            backgroundColor:text.background?.color,
            padding:text.padding||'20px',
            width:text.width||'auto',
            left:text.left||'auto',
            bottom:text.bottom||'auto',
            }}>

            {text.header &&
                <h1 style={{
                    fontSize:text_header_fontSize,
                }}>{text.header.text}</h1>
            }
            {text.subText &&
                <h3 style={{
                    fontSize:text_sub_fontSize,
                }}>{text.subText.text}</h3>
            }
        </div>}
    </div>
  );
};

export default Carousel;