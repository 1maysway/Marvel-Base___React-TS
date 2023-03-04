import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import qs from "qs";
import axios from "axios";
import {
  Character,
  Comic,
  Creator,
  MarvelCharactersOrderBy,
  MarvelComicsOrderBy,
  MarvelCreatorsOrderBy,
  MarvelEvent,
  MarvelEventsOrderBy,
  MarvelSeriesOrderBy,
  MarvelTypes,
  Series,
} from "../types/Types";
import { useNavigate, useLocation } from "react-router-dom";
import { PaginationParams } from "../pages/Search";

const startWith = [
  { type: "characters", startWith: "nameStartsWith", orderBy: '-modified' as MarvelCharactersOrderBy },
  { type: "creators", startWith: "nameStartsWith", orderBy: 'firstName' as MarvelCreatorsOrderBy},
  { type: "series", startWith: "titleStartsWith", orderBy: '-startYear' as MarvelSeriesOrderBy},
  { type: "events", startWith: "nameStartsWith", orderBy: '-startDate' as MarvelEventsOrderBy},
  { type: "comics", startWith: "titleStartsWith", orderBy: '-focDate' as MarvelComicsOrderBy}
];

type SearchComponentParams = {
  setResult: React.Dispatch<React.SetStateAction<MarvelTypes[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  fetchParams: {
    limit: number;
    apiKey: string;
  };
  paginationParams: PaginationParams;
  setPaginationParams: React.Dispatch<React.SetStateAction<PaginationParams>>;
};

const SearchComponent: React.FC<SearchComponentParams> = ({
  setResult,
  setIsLoading,
  setType,
  type,
  fetchParams,
  paginationParams,
  setPaginationParams,
}) => {
  const [query, setQuery] = React.useState(() => {
    const params = qs.parse(window.location.search.substring(1));
    return params.q ? params.q.toString() : "";
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event: SelectChangeEvent) => {
    updateLocationSearch(event.target.value.toLowerCase(), query);
  };

  const inputHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const updateLocationSearch = (type: string, query: string) => {
    const params = new URLSearchParams();

    params.set("type", type || "characters");
    if (query) params.set("q", query);

    navigate(`/search${params.toString() ? "?" + params.toString() : ""}`, {
      replace: false,
    });
  };

  const fetchSearch = async (
    type: string,
    query: string | null,
    paginationParams: PaginationParams
  ) => {
    if (!query || query === "") {
      return setResult([]);
    }

    setIsLoading(true);

    const start = startWith.find((start) => start.type === type)?.startWith;
    query = encodeURIComponent(query);

    let orderBy=startWith.find((elm)=> elm.type===type)?.orderBy;

    let paramsString = [
      `apikey=${fetchParams.apiKey}`,
      `ts=1`,
      `hash=d07458225043411f30c9aec7afb6f363`,
      `${start + "=" + query}`,
      `offset=${fetchParams.limit * paginationParams.page}`,
      `limit=${fetchParams.limit}`,
      `orderBy=${orderBy}`
    ];

    let url = `https://gateway.marvel.com/v1/public/${type}${
      paramsString ? "?" + paramsString.join("&") : ""
    }`;

    
    

    const request = await axios.get(url);
    const data = request.data.data;

    let res: MarvelTypes[] = [];

    switch (type) {
      case "characters":
        res = data.results.map((char: any) => {
          return {
            imageUrl: char.thumbnail.path + "." + char.thumbnail.extension,
            id: char.id,
            name: char.name,
            link: "/characters/" + char.id,
          } as Character;
        });
        break;
      case "comics":
        res = data.results.map((comic: any) => {
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
        break;
      case "series":
        res = data.results.map((series: any) => {
          return {
            imageUrl: series.thumbnail.path + "." + series.thumbnail.extension,
            id: series.id,
            title: series.title,
            link: "/series/" + series.id,
            startYear: series.startYear,
            endYear: series.endYear,
          } as Series;
        });
        break;
      case "creators":
        res = data.results.map((creator: any) => {
          return {
            imageUrl:
              creator.thumbnail.path + "." + creator.thumbnail.extension,
            id: creator.id,
            link: "/creators/" + creator.id,
            fullName: creator.fullName,
            middleName: creator.middleName,
            firstName: creator.firstName,
            lastName: creator.lastName,
          } as Creator;
        });
        break;
      case "events":
        res = data.results.map((event: any) => {
          return {
            imageUrl: event.thumbnail.path + "." + event.thumbnail.extension,
            id: event.id,
            title: event.title,
            link: "/events/" + event.id,
            start: event.start,
            end: event.end,
            description: event.description,
          } as MarvelEvent;
        });
        break;
    }

    setResult((prev) => {
      return paginationParams.page > 0 ? [...prev, ...res] : res;
    });
    if (paginationParams.page === 0) {
      setPaginationParams({
        page: 0,
        pageCount: Math.ceil(data.total / fetchParams.limit),
      });
    }

    // setTimeout(()=>{
    setIsLoading(false);
    // },2000)
  };

  useEffect(() => {
    const params = qs.parse(window.location.search.substring(1));
    const query = params.q ? params.q.toString() : null;
    const type = params.type ? params.type.toString() : "characters";

    setQuery(params.q ? params.q.toString() : "");
    setType(params.type ? params.type.toString() : "characters");
    setPaginationParams({ page: 0, pageCount: 0 });

    setPaginationParams({ page: 0, pageCount: 0 });
    fetchSearch(type || "characters", query ? query.toString() : null, {
      page: 0,
      pageCount: 0,
    });
  }, [location]);

  useEffect(() => {
    if (paginationParams.page > 0) {
      fetchSearch(type, query, paginationParams);
    }
  }, [paginationParams]);

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (query.split("").some((char) => char !== " ")) {
      updateLocationSearch(type, query);
    }
  };

  const items = ["Characters", "Comics", "Events", "Series", "Creators"];

  return (
    <form id="form" onSubmit={submit}>
      <Grid container id="form_container">
        <Grid item xs={12} md={10} id="input_grid_item">
          <Grid
            container
            direction={{ xs: "row" }}
            id="input_grid_item_container"
          >
            <Grid item xs>
              <input
                id="search_input"
                type="text"
                placeholder="Search query"
                onChange={inputHandleChange}
                value={query}
                autoFocus
              />
            </Grid>
            <Grid
              item
              xs="auto"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Select
                id="demo-simple-select-filled"
                value={type}
                onChange={handleChange}
                sx={{
                  width: "100%",
                  borderRadius: 0,
                }}
              >
                {items.map((text) => (
                  <MenuItem key={text} value={text.toLowerCase()}>
                    {text}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <button id="search_submit_btn" type="submit">
            Search
          </button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchComponent;
