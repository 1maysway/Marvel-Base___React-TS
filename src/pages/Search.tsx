import { Box, CircularProgress, Container, Grid } from "@mui/material";
import qs from "qs";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import SearchComponent from "../components/SearchComponent";
import "../scss/pages/_search.scss";
import { Character, MarvelTypes } from "../types/Types";
import GridIcon from "@mui/icons-material/GridView";
import RowsIcon from "@mui/icons-material/TableRows";
import { isMobile } from "react-device-detect";

export type PaginationParams = {
  page: number;
  pageCount: number;
};

const fetchParams = {
  limit: 10,
  apiKey: "f12271bcc0e384057f5933ffa8dc83d0",
};

const Search: React.FC = () => {
  const [result, setResult] = React.useState<MarvelTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = React.useState(() => {
    const params = qs.parse(window.location.search.substring(1));
    return params.type ? params.type.toString() : "characters";
  });
  const [showingType, setShowingType] = useState<"cells" | "rows">("rows");
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    pageCount: 0,
  });

  const loadMoreHandler = () => {
    setPaginationParams((prev) => {
      return { ...prev, page: prev.page + 1 };
    });
  };
  let resultForCards = [];
  resultForCards = result.map((res: any) => {
    return {
      title: res.name || res.title || res.fullName,
      subText:
        res.date ||
        (res.startYear && res.endYear
          ? res.startYear + "-" + res.endYear
          : res.start && res.end
          ? res.start + "-" + res.end
          : null),
      imageUrl: res.imageUrl,
      link: res.link,
    };
  });

  return (
    <div id="search_page">
      <Grid container flexDirection={"column"}>
        <Grid item xs={12} className="searchBar_container">
          <Grid container>
            <Grid item xs={12}>
              <SearchComponent
                setResult={setResult}
                setIsLoading={setIsLoading}
                setType={setType}
                type={type}
                fetchParams={fetchParams}
                paginationParams={paginationParams}
                setPaginationParams={setPaginationParams}
              />
            </Grid>
            <Grid item xs={12} className="result_buttons" padding={"24px"}>
              <Grid container className="result_buttons_container" spacing={2}>
                <Grid item xs="auto" className="result_button_container">
                  <button
                    onClick={() => {
                      setShowingType((prev) =>
                        prev === "cells" ? "rows" : "cells"
                      );
                    }}
                    className="result_button"
                  >
                    {showingType === "cells" ? (
                      <GridIcon fontSize="large" />
                    ) : (
                      <RowsIcon fontSize="large" />
                    )}
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="result_container">
          <Grid container>
            <Grid item xs={12}>
              <Grid container className="result_inner">
                {(!isLoading && result.length > 0) ||
                (isLoading && paginationParams.page > 0) ? (
                  resultForCards.map(
                    ({ title, subText, imageUrl, link = {} }, index) => {
                      return (
                        <Grid
                          key={index}
                          item
                          xs={showingType === "rows" ? 12 : 6}
                          className="result_item"
                          // height={{xs:'400px',md:'280px'}}
                        >
                          <Link to={link} className="link">
                            <Grid
                              container
                              className="result_item_inner"
                              spacing={{xs:0,md:4}}
                              height={{ xs:'100%',md: "280px" }}
                              // flexDirection={{ xs: "column", md: "row" }}
                              justifyContent={{xs:"center",md:"start"}}
                              alignItems={{xs:"center",md:"start"}}
                            >
                              <Grid
                                item
                                xs={12}
                                md="auto"
                                className="result_item_inner_image_container"
                                width={{ md: "280px" }}
                                height={{xs:'280px',md:'280px'}}
                              >
                                <img src={imageUrl} />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md
                                className="result_item_inner_body"
                              >
                                <Grid
                                  container
                                  flexDirection={"column"}
                                  spacing={2}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    className="title_container"
                                    style={{
                                      fontSize:
                                        showingType === "cells" && isMobile
                                          ? "16px"
                                          : "24px",
                                    }}
                                  >
                                    <span className="title">{title}</span>
                                  </Grid>
                                  {subText && (
                                    <Grid
                                      item
                                      xs={12}
                                      className="subtext_container"
                                      style={{
                                        fontSize:
                                          showingType === "cells" && isMobile
                                            ? "8px"
                                            : "12px",
                                      }}
                                    >
                                      <span className="subtext">{subText}</span>
                                    </Grid>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </Link>
                        </Grid>
                      );
                    }
                  )
                ) : isLoading ? (
                  <Box className="preload">
                    <CircularProgress color="error" />
                  </Box>
                ) : (
                  <Box className="preload">
                    <h1>No matches found</h1>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              marginTop="48px"
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              {!isLoading && result.length > 0 ? (
                paginationParams.page < paginationParams.pageCount - 1 ? (
                  <button id="loadMore_button" onClick={loadMoreHandler}>
                    Load more
                  </button>
                ) : (
                  <h3>No more results</h3>
                )
              ) : isLoading && paginationParams.page > 0 ? (
                <CircularProgress color="error" />
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;
