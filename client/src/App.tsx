import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { authRoutes } from "./routes";
import ProtectedLayout from './layout/ProtectedLayout';
import PublicLayout from './layout/PublicLayout';
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedLayout />}>         

          {authRoutes.map(route => (
            <Route path={route.path} element={route.element} key={route.path}/>
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>


    </BrowserRouter>
  );
}

export default App;
