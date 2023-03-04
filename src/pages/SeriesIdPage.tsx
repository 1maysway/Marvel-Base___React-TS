import { CircularProgress, Grid } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link, To, useLocation } from "react-router-dom";
import Preloader from "../components/Preloader";
import { Slider } from "../components/Slider";
import "../scss/pages/_seriesIdPage.scss";

type Result = {
  title: string;
  description: string;
  modified: string;
  textObjects: [
    {
      type: string;
      language: string;
      text: string;
    }
  ];
  urls: [
    {
      type: string;
      url: string;
    }
  ];
  format: string;
  pageCount: number;
  dates: [
    {
      type: string;
      date: string;
    }
  ];
  prices: [
    {
      type: string;
      price: string;
    }
  ];
  imageUrl: string;
  images: [
    {
      path: string;
      extension: string;
    }
  ];
  creators: {
    avalible: number;
    collectionURI: string;
    items: [
      {
        resourceURI: string;
        name: string;
        role: string;
      }
    ];
    returned: number;
  };
  characters: {
    avalible: number;
    collectionURI: string;
    items: [
      {
        resourceURI: string;
        name: string;
      }
    ];
    returned: number;
  };
  stories: {
    avalible: number;
    collectionURI: string;
    items: [
      {
        resourceURI: string;
        name: string;
        type: string;
      }
    ];
    returned: number;
  };
  events: {
    avalible: number;
    collectionURI: string;
    items: [
      {
        resourceURI: string;
        name: string;
      }
    ];
    returned: number;
  };
  comics: {
    avalible: number;
    collectionURI: string;
    returned:number;
    items:[
      {
        collectionURI: string;
        name:string;
      }
    ]
  }
  resourceURI: string;
  rating :string;
  startYear:number;
  endYear:number;
  next:{
    collectionURI: string;
    name:string;
  }
  previous:{
    collectionURI: string;
    name:string;
  }
};

type MoreItem={
  imageUrl:string;
  title:string;
  link:To;
  id:number;
}
type LinkInTitle={
  text:string;
  to:To;
}

type More={
  title:string;
  items:MoreItem[];
  linksInTitle?:LinkInTitle[];
}

const API_AUTH='apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363';

function SeriesIdPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [isAllCreators,setIsAllCreators]=useState(false);
  const [moreLikeThat,setMoreLikeThat]=useState<More|null>(null);
  const [moreSeries, setMoreSeries]=useState<More|null>(null);
  const [seriesId,setSeriesId]=useState(()=>{
    return parseInt(window.location.pathname.split("/").reverse()[0])||1;
  });
  const location = useLocation();
  const [fetchAttempts,setFetchAttempts]=useState<{result:boolean;moreLikeThat:boolean;moreSeries:boolean;}>({result:false,moreLikeThat:false,moreSeries:false});

  const fetchResult=async(id:number=seriesId):Promise<Result|null>=>{
    const url = `https://gateway.marvel.com:443/v1/public/series/${id}?apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363`;

    const request=await axiosGet(url,setError);
    if(!request) {
      return null;
    }
    const data = request.data;
    const dataResult = data.data.results[0];

    const res: Result = {
      title: dataResult.title,
      description: dataResult.description,
      modified: dataResult.modified,
      textObjects: dataResult.textObjects,
      urls: dataResult.urls,
      format: dataResult.format,
      pageCount: dataResult.pageCount,
      dates: dataResult.dates,
      prices: dataResult.prices,
      imageUrl:
        dataResult.thumbnail.path + "." + dataResult.thumbnail.extension,
      creators: dataResult.creators,
      characters: dataResult.characters,
      stories: dataResult.stories,
      events: dataResult.events,
      images: dataResult.images,
      next: dataResult.next,
      previous: dataResult.previous,
      comics: dataResult.comics,
      resourceURI: dataResult.resourceURI,
      rating: dataResult.rating,
      startYear: dataResult.startYear,
      endYear: dataResult.endYear
    };
    setFetchAttempts(prev=>({...prev,result:true}));
    return res;
  }

  const axiosGet=async(url:string,setError:React.Dispatch<React.SetStateAction<string|null>>|null=null)=>{
    let request;
    try {
      request = await axios.get(url);
    } catch (e: any) {
      if(setError){
        setError(e.response.status);
      }
      return null;
    }
    return request;
  }
  
  const shuffleArray = (array: any[]) => {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  };

  const fetchMoreLikeThat=async(text:string,id:number=seriesId):Promise<More|null>=>{
    const url = `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${encodeURIComponent(text)}&orderBy=-onsaleDate&`+API_AUTH;
    
    const request = await axiosGet(url);
    if(!request){
      return null;
    }
    const data = request.data;
    const dataResult = data.data.results;

    const res:More={
      title:text.toUpperCase()+" COMICS",
      items:dataResult.map((elm:any)=>({
        imageUrl:elm.thumbnail.path+'.'+elm.thumbnail.extension,
        title:elm.title,
        link:'/comics/'+elm.id,
        id:elm.id
      })).filter((elm:any)=>elm.id!==id)
    }
    setFetchAttempts(prev=>({...prev,moreLikeThat:true}));
    return res;
  }

  const fetchMoreSeriesByCharacters=async(characters:{id:string|number,name:string}[]):Promise<More|null>=>{
    const orderBy="-startYear";
    const urls = characters.map(({id})=>
    `https://gateway.marvel.com:443/v1/public/characters/${id}/series?orderBy=${orderBy}&limit=10&`+API_AUTH
    );

    let series:any[] = [];
    const linksToCharacters:LinkInTitle[] = characters.map(({id,name})=>
      ({
        text:name,
        to:'/characters/'+id
      })
    );

    await Promise.all(urls.map(async(url)=>{
      const request = await axiosGet(url);
      if(!request){
        series = series.concat(null);
        return;
      }
      const data = request.data;
      const dataResult = data.data.results;
      series = series.concat(dataResult);
    }))
    
    const items = shuffleArray(series.map((elm:any)=>{
      return({
      imageUrl:elm.thumbnail.path+'.'+elm.thumbnail.extension,
      title:elm.title,
      link:'/series/'+elm.id,
      id:elm.id
    })}))

    const res:More={
      title:"RECOMMENDED SERIES"+(isMobile?'':' WITH: '),
      linksInTitle:linksToCharacters,
      items
    }
    setFetchAttempts(prev=>({...prev,moreSeries:true}));
    return res;
  }

  const fetchData = async () => {
    setIsLoading(true);

    const id=parseInt(window.location.pathname.split("/").reverse()[0])||1;
    const resultResponse=await fetchResult(id);
    if(!resultResponse){
      return;
    }
    setResult(resultResponse);

    const moreLikeThatResponse=await fetchMoreLikeThat(resultResponse?.title.split(' (')[0].split(':')[0]||'',id);
    setMoreLikeThat(moreLikeThatResponse);

    setIsLoading(false);
    
    const characters=resultResponse.characters.items.map((char)=>({id:char.resourceURI.split('/').reverse()[0],name:char.name})).slice(0,5);
    
    const moreSeries = await fetchMoreSeriesByCharacters(characters);
    setMoreSeries(moreSeries);
  };

  useEffect(() => {
    setSeriesId(parseInt(window.location.pathname.split("/").reverse()[0])||1);
    fetchData();
    window.scrollTo(0, 0)
  }, [location]);

  useEffect(()=>{
    document.title = result?.title||'MARVEL BASE'
  },[result])

  if(isLoading) {
    return <Preloader />
  }

  if (error || !result) {
    return (
      <div id="series_page">
        <div className="code404_container">
          <div className="code404_inner">
            <h1 className="code404_text">{error||'Error'}</h1>
          </div>
        </div>
      </div>
    );
  }
  

  const convertISOToDate = (ISODate: string) => {
    if (ISODate === "") return "";

    const months = [
      {
        number: "01",
        month: "January",
      },
      {
        number: "02",
        month: "February",
      },
      {
        number: "03",
        month: "Marth",
      },
      {
        number: "04",
        month: "April",
      },
      {
        number: "05",
        month: "May",
      },
      {
        number: "06",
        month: "June",
      },
      {
        number: "07",
        month: "July",
      },
      {
        number: "08",
        month: "August",
      },
      {
        number: "09",
        month: "September",
      },
      {
        number: "10",
        month: "October",
      },
      {
        number: "11",
        month: "November",
      },
      {
        number: "12",
        month: "December",
      },
    ];

    const dateArray = ISODate.substring(0, 10).split("-");

    return (
      months.find((month) => month.number === dateArray[1])?.month +
      " " +
      dateArray[2] +
      ", " +
      dateArray[0]
    );
  };

  const sortMoreByAvalibleImages = (more:More | null)=>{
    return {...more,items:more?.items.sort((a,b)=>a.imageUrl.includes('not_available') ? 1 : (b.imageUrl.includes('not_available') ? -1:0))||[]}
  }
  const mapMoreToSlides=({imageUrl,title,link}:MoreItem)=>{
    return {
      image:imageUrl,
      link,
      title
    }
  }

  let dataForResultShowing:any[]=[];

  result.creators.items.forEach(({ resourceURI, name, role },index)=>{
    let dataItem=dataForResultShowing.find((elm)=>elm.role.toLowerCase()===role);
    const itemForPush={
      name,
      link: "/creators/" + resourceURI.split("/").reverse()[0],
    };

    if(!dataItem) {
      dataForResultShowing.push({role:role.substring(0, 1).toUpperCase() + role.substring(1),index:dataForResultShowing.length,items:[itemForPush]});
    } else {
      dataForResultShowing[dataItem.index].items.push(itemForPush);
    }
  })

  const resultForShowing = {
    published: convertISOToDate(
      result.modified || ""
    ),
    data: dataForResultShowing as [{role:string;index:number;items:[{name:string;link:string;}]}],
    description:result.description
  };

  const slidesForMoreLikeThat=sortMoreByAvalibleImages(moreLikeThat).items.map(mapMoreToSlides);

  const slidesForMoreSeries = sortMoreByAvalibleImages(moreSeries).items.map(mapMoreToSlides);
  return (
    <div id="series_page">
      <Grid container className="series_page_container">
        <Grid item xs={12} marginBottom={"144px"}>
          <section className="series_page_firstSection">
            <Grid container spacing={8}>
              <Grid item className="series_page_leftSide" xs={12} md={4}>
                <Grid container className="series_page_leftSide_container">
                  <Grid item className="series_page_leftSide_item" padding={{xs:"24px",md:"0px"}}>
                    <div className="image_container">
                      <img src={result.imageUrl} alt="" />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="series_page_rightSide" xs={12} md>
                <Grid container className="series_page_rightSide_container">
                  <Grid item className="series_page_rightSide_item">
                    <Grid
                      container
                      className="series_page_rightSide_item_container"
                    >
                      <Grid item className="rightSide_title" xs={12}>
                        <h1 className="rightSide_title_text">{result.title}</h1>
                      </Grid>
                      <Grid item className="rightSide_data" xs={12}>
                        <Grid
                          container
                          className="rightSide_data_container"
                          spacing={4}
                        >
                          <Grid item className="rightSide_data_item" xs={12}>
                            <strong className="rightSide_data_item_title">
                              Published:
                            </strong>
                            <div className="rightSide_data_item_value">
                              {resultForShowing.published}
                            </div>
                          </Grid>
                          {resultForShowing.data.map(
                            ({ items,role }) => {
                              return (
                                <Grid
                                  item
                                  className="rightSide_data_item"
                                  key={role}
                                  xs={6}
                                >
                                  <strong className="rightSide_data_item_title">
                                    {role}:
                                  </strong>
                                  <Grid container className="rightSide_data_item_value_container">
                                    { items.map(({name,link},i)=>(
                                      <Grid item className="rightSide_data_item_value" key={link}>
                                        <Link
                                          to={link}
                                          className='rightSide_data_item_value_text'
                                        >
                                          {name}
                                        </Link>
                                        { i<items.length-1 &&
                                          <>
                                            ,&nbsp;
                                          </>
                                        }
                                      </Grid>
                                    ))
                                    }
                                  </Grid>
                                </Grid>
                              );
                            }
                          )}
                        </Grid>
                      </Grid>
                      { resultForShowing.description &&
                      <Grid
                        item
                        className="rightSide_description"
                        xs={12}
                      >
                        <div className="description_text" dangerouslySetInnerHTML={{__html:resultForShowing.description}}></div>
                      </Grid>
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </section>
        </Grid>
          <Grid item xs={12}>
            <section className="more">
              <Grid container className="more_container" style={{paddingTop:'48px'}}>
                { (moreLikeThat && moreLikeThat.items.length>0) &&
                  <Grid item xs={12}>
                    <section className="moreLikeThat">
                      <Grid container className="moreLikeThat_container">
                        <Grid item xs={12} className='moreLikeThat_text_container'>
                          <h1 className="moreLikeThat_text">{moreLikeThat.title}</h1>
                        </Grid>
                        <Grid item xs={12} height='500px'>
                          <Slider slides={slidesForMoreLikeThat}/>
                        </Grid>
                        
                      </Grid>
                    </section>
                  </Grid>
                }
                { (moreSeries && moreSeries.items.length>0) ?
                  <Grid item xs={12}>
                    <section className="moreSeries">
                      <Grid container className="moreSeries_container">
                        <Grid item xs={12} >
                          <Grid container className="moreSeries_text_container">
                            <Grid item md={'auto'} xs={12} className="moreSeries_text_inner">
                              <h1 className="moreSeries_text">{moreSeries.title}&nbsp;</h1>
                            </Grid>
                            { !isMobile &&
                              <Grid item md xs={12} className="moreSeriest_text_links">
                                <Grid container className="moreSeriest_text_links_container">
                                  { moreSeries.linksInTitle && 
                                    moreSeries.linksInTitle.map(({text,to},i,array)=>(
                                              <Grid item className="moreSeries_text_links_inner" key={text}>
                                                <Link
                                                  to={to}
                                                  className='moreSeries_text_link'
                                                >
                                                  {text}
                                                </Link>
                                                { i<array.length-1 &&
                                                  <>
                                                    ,&nbsp;
                                                  </>
                                                }
                                              </Grid>
                                            ))
                                            }
                                </Grid>
                              </Grid>
                            }
                          </Grid>
                        </Grid>
                        <Grid item xs={12} height='500px'>
                          <Slider slides={slidesForMoreSeries}/>
                        </Grid>
                      </Grid>
                    </section>
                  </Grid>
                  : !fetchAttempts.moreSeries && 
                    <Grid item xs={12} height='500px' justifyContent={'center'} alignItems={'center'} display={'flex'}><CircularProgress color="error"/></Grid>
                }
              </Grid>
              <div className="background"></div>
            </section>
          </Grid>
        
      </Grid>
    </div>
  );
}

export default SeriesIdPage;
