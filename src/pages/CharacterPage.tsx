import { Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";
import Cards, { CardProps } from "../components/Cards";
import Preloader from "../components/Preloader";
import { SlideProps, Slider } from "../components/Slider";

import "../scss/pages/_characterPage.scss";
import CachedData, { addToCache } from "../Utils/CachedData";

const API_AUTH =
  "apikey=f12271bcc0e384057f5933ffa8dc83d0&ts=1&hash=d07458225043411f30c9aec7afb6f363";

function CharacterPage() {
  const [characterId, setCharacterId] = useState(() => {
    return parseInt(window.location.pathname.split("/").reverse()[0]) || 1;
  });
  const [character, setCharacter] = useState<any>(null);
  const [comics, setComics] = useState<any>([]);
  const [series, setSeries] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const [canLoadMoreComics, setCanLoadMoreComics] = useState<boolean>(true);
  const [canLoadMoreSeries, setCanLoadMoreSeries] = useState<boolean>(true);

  const axiosGet = async (
    url: string,
    setError: React.Dispatch<React.SetStateAction<string | null>> | null = null
  ) => {
    let request;
    try {
      request = await axios.get(url);
    } catch (e: any) {
      if (setError) {
        setError(e.response.status);
      }
      return null;
    }
    return request;
  };

  const fetchCharacter = async (canSetState: boolean = false) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}?${API_AUTH}`;

    const response = await axiosGet(url, setError);

    if (!response) {
      return null;
    }

    const data = response.data.data;

    if (canSetState) {
      setCharacter(data.results[0]);
    }
    return data.results[0];
  };

  const fetchComics = async (canSetState: boolean = false) => {
    const offset = comics.length;
    const limit = isMobile ? 6 : 10;

    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?limit=${limit}&offset=${offset}&${API_AUTH}`;

    const response = await axiosGet(url, setError);

    if (!response) {
      return null;
    }

    const data = response.data.data;
    const newComics = [...comics, ...data.results];

    if (newComics.length === data.total) {
      setCanLoadMoreComics(false);
    }

    addToCache(
      {
        character,
        comics: newComics,
        series,
      },
      "character_page_data"
    );

    if (canSetState) {
      setComics(newComics);
    }
    return newComics;
  };

  const fetchSeries = async (canSetState: boolean = false) => {
    const offset = series.length;
    const limit = isMobile ? 6 : 12;

    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/series?limit=${limit}&offset=${offset}&${API_AUTH}`;

    const response = await axiosGet(url, setError);

    if (!response) {
      return null;
    }

    const data = response.data.data;
    const newSeries = [...series, ...data.results];

    if (newSeries.length === data.total) {
      setCanLoadMoreSeries(false);
    }

    if (canSetState) {
      setSeries(newSeries);
    }
    return newSeries;
  };

  const fetchData = async (): Promise<Record<string, any> | null> => {
    setIsLoading(true);

    const characterResponse = await fetchCharacter();
    setCharacter(characterResponse);
    const comicsResponse = await fetchComics();
    setComics(comicsResponse);

    setIsLoading(false);

    const seriesResponse = await fetchSeries();
    setSeries(seriesResponse);
    return {
      character: characterResponse,
      comics: comicsResponse,
      series: seriesResponse,
    };
  };

  useEffect(() => {
    const id = parseInt(window.location.pathname.split("/").reverse()[0]) || 1;
    setCharacterId(id);
    window.scrollTo(0, 0);
    setIsLoading(true);

    CachedData(
      {
        character: setCharacter,
        comics: setComics,
        series: setSeries,
      },
      fetchData,
      {
        sessionItemKey: "character_page_data",
        cacheDuration_ms: 120000,
        compare: {
          key: "character.id",
          value: id,
        }
      }
    ).then(() => {
      setIsLoading(false);
    });
  }, [location]);

  useEffect(() => {
    document.title = character?.name || "MARVEL BASE";
  }, [character]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error || !character) {
    return (
      <div id="series_page">
        <div className="code404_container">
          <div className="code404_inner">
            <h1 className="code404_text">{error || "Error"}</h1>
          </div>
        </div>
      </div>
    );
  }

  const sortCardsByAvalibleImages = (cards: CardProps[] | null) => {
    return (
      cards?.sort((a, b) =>
        a.image.includes("not_available")
          ? 1
          : b.image.includes("not_available")
          ? -1
          : 0
      ) || []
    );
  };

  const comicsForCards: CardProps[] =
    comics?.map((elm: any) => {
      return {
        image: elm.thumbnail.path + "." + elm.thumbnail.extension,
        title: elm.title,
        link: "/comics/" + elm.id,
      };
    }) || [];

  const seriesForSlider: SlideProps[] =
    sortCardsByAvalibleImages(
      series?.map((elm: any) => {
        return {
          image: elm.thumbnail.path + "." + elm.thumbnail.extension,
          title: elm.title,
          link: "/series/" + elm.id,
        };
      })
    ) || [];

  const characterImage =
    character.thumbnail.path + "." + character.thumbnail.extension;

  return (
    <div id="character_page">
      <Grid container>
        <Grid item xs={12}>
          <Grid container className="character_image_container">
            <Grid item xs={12} md={6} className="character_image_text">
              <h1 className="title">{character?.name}</h1>
              {character?.description && (
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: character.description }}
                ></div>
              )}
            </Grid>
            <div className="background">
              <img src={characterImage} />
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} marginTop="96px">
          <Grid container>
            <Grid item xs={12}>
              <h1>{character.name.toUpperCase()}: COMICS</h1>
            </Grid>
            <Grid item xs={12}>
              <Cards
                cards={comicsForCards}
                cardsHeight={{ xs: 300, sm: 600, md: 400, lg: 500 }}
                spacing="24px"
                cardsCol={{ xs: 6, md: 3, lg: 2.4 }}
                moreButton={
                  canLoadMoreComics
                    ? {
                        text: "Load more",
                        action: async () => {
                          fetchComics(true);
                        },
                      }
                    : null
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} paddingTop="24px">
          <Grid container>
            <Grid item xs={12}>
              <h1>{character.name.toUpperCase()}: SERIES</h1>
            </Grid>
            <Grid item xs={12} height={"500px"}>
              <Slider slides={seriesForSlider} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CharacterPage;
