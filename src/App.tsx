import React, { Suspense } from 'react';
import {Route, Routes}from'react-router-dom'
import MainLayout from './layouts/MainLayout';
import Main from './pages/Main';

import './scss/components/_all.scss'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Main/>} />
        <Route
          path="cart"
          element={
            <Suspense fallback={<div>Идёт загрузка корзины...</div>}>
              <h1>WORK</h1>
            </Suspense>
          }
        />
        <Route
          path="pizza/:id"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <h1>WORK</h1>
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <h1>WORK</h1>
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )}

export default App;
