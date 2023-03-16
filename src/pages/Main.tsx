import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Header from "../components/Header";
import { Box, CircularProgress, Container } from "@mui/material";
import Search from "../components/SearchComponent";
import {
  Comic,
  Character,
  Series,
  MarvelTypes,
  MarvelSeriesOrderBy,
  MarvelAPIOptions,
} from "../types/Types";

import "../scss/pages/_main.scss";
import Carousel from "../components/Carousel";
import axios from "axios";
import { log } from "console";
import Cards from "../components/Cards";
import { Slider } from "../components/Slider";
import useWindowSize from "../hooks/useWindowSize";
import { isMobile } from "react-device-detect";
import Preloader from "../components/Preloader";
import CachedData from "../Utils/CachedData";
import ListenHtmlEvent from "../Utils/ListenHtmlEvent";

const API_AUTH =
  "apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363";
const charactersOrders = ["-modified", "name"];
const randomOrderBy =
  charactersOrders[Math.floor(Math.random() * charactersOrders.length)];

const Main: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [screenSize] = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);

  const notAvalibleImageFilter = (array: MarvelTypes[]) => {
    return array.filter(
      (elm: MarvelTypes) => !elm.imageUrl.includes("image_not_available")
    );
  };

  const axiosGet = async (url: string) => {
    let request;
    try {
      request = await axios.get(url);
    } catch (e: any) {
      return null;
    }
    return request;
  };

  const fetchCharacters = async (
    options: MarvelAPIOptions = { limit: 20, offset: 0, need: 20 },
    arrayForConcat: Character[] = []
  ): Promise<Character[]> => {
    options.limit = options.limit || 20;
    options.offset = options.offset || 0;
    options.need = options.need || 20;

    const url = `https://gateway.marvel.com/v1/public/characters?
    orderBy=${randomOrderBy}
    ${options.limit ? "&limit=" + options.limit : ""}
    ${options.offset ? "&offset=" + options.offset : ""}
    &${API_AUTH}`
      .split("\n")
      .join("")
      .split(" ")
      .join("");
    const request = await axiosGet(url);
    if (!request) {
      return [];
    }
    const data = request.data;
    const dataResult = data.data.results;

    const res: Character[] = dataResult.map((char: any) => {
      return {
        imageUrl: char.thumbnail.path + "." + char.thumbnail.extension,
        id: char.id,
        name: char.name,
        link: "/characters/" + char.id,
      } as Character;
    });
    const filteredRes = notAvalibleImageFilter(res) as Character[];
    const concatedRes = arrayForConcat.concat(filteredRes);

    if (concatedRes.length < options.need) {
      return await fetchCharacters(
        {
          ...options,
          ...(options.limit < 100
            ? { limit: Math.min(options.limit + 20, 100) }
            : { offset: options.limit }),
        },
        concatedRes
      );
    }
    // setCharacters(concatedRes);
    return concatedRes;
  };

  const fetchComics = async (
    options: MarvelAPIOptions = { limit: 20, offset: 0, need: 20 },
    arrayForConcat: Comic[] = []
  ): Promise<Comic[]> => {
    options.limit = options.limit || 20;
    options.offset = options.offset || 0;
    options.need = options.need || 20;

    const url = `https://gateway.marvel.com/v1/public/comics?
    orderBy=-focDate
    ${options.limit ? "&limit=" + options.limit : ""}
    ${options.offset ? "&offset=" + options.offset : ""}
    &${API_AUTH}`
      .split("\n")
      .join("")
      .split(" ")
      .join("");

    const request = await axiosGet(url);
    if (!request) {
      return [];
    }
    const data = request.data;
    const dataResult = data.data.results;

    const res = dataResult.map((comic: any) => {
      let date = comic.dates
        .find((date: any) => date.type === "onsaleDate")
        .date.substring(0, 10)
        .split("-")[0];
      return {
        imageUrl: comic.thumbnail.path + "." + comic.thumbnail.extension,
        id: comic.id,
        title: comic.title,
        date: date,
        link: "/comics/" + comic.id,
      } as Comic;
    });

    const filteredRes = notAvalibleImageFilter(res) as Comic[];
    const concatedRes = arrayForConcat.concat(filteredRes);

    console.log("FETCH COMICS !!!");

    if (concatedRes.length < options.need) {
      return await fetchComics(
        {
          ...options,
          ...(options.limit < 100
            ? { limit: Math.min(options.limit + 20, 100) }
            : { offset: options.limit }),
        },
        concatedRes
      );
    }

    // setComics(notAvalibleImageFilter(res) as Comic[]);
    return concatedRes;
  };

  const fetchSeries = async (
    options: MarvelAPIOptions = { limit: 20, offset: 0, need: 20 },
    arrayForConcat: Series[] = []
  ): Promise<Series[]> => {
    options.limit = options.limit || 20;
    options.offset = options.offset || 0;
    options.need = options.need || 20;

    const seriesOrderBy: MarvelSeriesOrderBy = "-startYear";
    const url = `https://gateway.marvel.com/v1/public/series?
    orderBy=${seriesOrderBy}
    ${options.limit ? "&limit=" + options.limit : ""}
    ${options.offset ? "&offset=" + options.offset : ""}
    &${API_AUTH}`
      .split("\n")
      .join("")
      .split(" ")
      .join("");

    const request = await axiosGet(url);
    if (!request) {
      return [];
    }
    const data = request.data;
    const dataResult = data.data.results;

    const res = dataResult.map((series: any) => {
      return {
        imageUrl: series.thumbnail.path + "." + series.thumbnail.extension,
        id: series.id,
        title: series.title,
        link: "/series/" + series.id,
        startYear: series.startYear,
        endYear: series.endYear,
      } as Series;
    });

    const filteredRes = notAvalibleImageFilter(res) as Series[];
    const concatedRes = arrayForConcat.concat(filteredRes);

    if (concatedRes.length < options.need) {
      return await fetchSeries(
        {
          ...options,
          ...(options.limit < 100
            ? { limit: Math.min(options.limit + 20, 100) }
            : { offset: options.limit }),
        },
        concatedRes
      );
    }

    // setSeries(notAvalibleImageFilter(res) as Series[]);
    return concatedRes;
  };

  const fetchData = async (): Promise<{
    characters: Character[] | null;
    comics: Comic[] | null;
    series: Series[] | null;
  } | null> => {
    const charactersResponse = await fetchCharacters({
      limit: 20,
      offset: 0,
      need: 20,
    });
    setCharacters(charactersResponse);

    const comicsResponse = await fetchComics({ limit: 40, need: 20 });
    setComics(comicsResponse);

    setIsLoading(false);

    const seriesResponse = await fetchSeries({ limit: 100, need: 20 });
    setSeries(seriesResponse);

    return {
      characters: charactersResponse,
      comics: comicsResponse,
      series: seriesResponse,
    };
  };

  

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    CachedData(
      {
        characters: setCharacters,
        comics: setComics,
        series: setSeries,
      }, fetchData,
      {
        sessionItemKey: "main_page_data",
        cacheDuration_ms: 120000,
      }
    ).then(() => {
      setIsLoading(false);
    });

  }, []);
  useEffect(() => {
    document.title = "MARVEL BASE";
  }, []);

  const comicsForSlider = comics.map(({ imageUrl, title, date, link }) => {
    return { image: imageUrl, title, subText: date, link };
  });

  const seriesForCards = series.map(
    ({ imageUrl, title, link, startYear, endYear }) => {
      return {
        image: imageUrl,
        title,
        link,
        subText: startYear + "-" + endYear,
      };
    }
  );

  if (isLoading) {
    return <Preloader style={{ backgroundColor: "white" }} />;
  }

  return (
    <div id="main_page">
      <Grid container className="container">
        {/* {characters.length>0 ?  */}
        <Grid
          id="main_page_first_banner"
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={500}
        >
          <div className="first_banner_container" style={{ width: screenSize }}>
            <Carousel
              slides={characters
                .map((character) => character.imageUrl)
                .slice(0, 20)}
              columnSpacing={20}
              text={{
                header: { text: "MARVEL BASE", fontSize: "48px" },
                subText: { text: "The marvel company", fontSize: "24px" },
                color: "white",
                background: { color: "rgba(32, 32, 32,0.5)" },
                width: "50%",
                bottom: "80px",
                padding: "30px",
              }}
              rotate={isMobile ? -10 : -2}
              duration={120}
              slideWidth={400}
            />
          </div>
        </Grid>
        {/* : <Grid id='main_page_first_banner' item xs={12} display='flex' justifyContent='center' alignItems='center'><CircularProgress color='error'/></Grid>
          } */}
        <Grid
          id="main_page_rec_comics"
          item
          xs={12}
          justifyContent="center"
          alignItems="center"
          display="flex"
          padding={{ xs: "0px", lg: "24px" }}
        >
          <div
            id="main_page_rec_comics_inner"
            style={{ padding: isMobile ? "0px" : "24px" }}
          >
            <Slider
              slides={comicsForSlider}
              slideOptions={{ width: 200 }}
              maxStep={3}
            />
          </div>
          <div className="background"></div>
        </Grid>
        <Grid
          id="main_page_rec_series"
          item
          xs={12}
          justifyContent="center"
          alignItems="center"
          display="flex"
        >
          <div id="main_page_rec_series_inner">
            <div className="title_container">
              <h1 className="title">Series</h1>
            </div>
            <Cards
              cards={seriesForCards.slice(0, isMobile ? 6 : 12)}
              cardsHeight={{ xs: 400 }}
              spacing="24px"
              cardsCol={{ xs: 12, sm: 6, lg: 2 }}
              moreButton={{
                text: "More series",
                action: "/search/?type=series",
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Main;
