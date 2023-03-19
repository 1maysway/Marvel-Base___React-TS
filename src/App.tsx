import React, { Suspense } from 'react';
import {HashRouter, Route, Routes}from'react-router-dom'
import MainLayout from './layouts/MainLayout';
import CharacterPage from './pages/CharacterPage';
import ComicPage from './pages/ComicPage';
import CreatorPage from './pages/CreatorPage';
import Main from './pages/Main';
import Search from './pages/Search';
import SeriesIdPage from './pages/SeriesIdPage';

import './scss/components/_all.scss';

function App() {
  return (
    <Routes >
      {/* <Route path="/" element={<MainLayout />} > */}
        <Route path="/" element={<Main/>} />
        <Route
          path="/comics/:id"
          element={<ComicPage/>}
        />
        <Route
          path="/search"
          element={<Search/>}
        />
        <Route
          path="/series/:id"
          element={<SeriesIdPage/>}
        />
        <Route
          path="/creators/:id"
          element={<CreatorPage/>}
        />
        <Route
          path="/characters/:id"
          element={<CharacterPage/>}
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <h1>WORK</h1>
            </Suspense>
          }
        />
      {/* </Route> */}
    </Routes>
  )}

export default App;
