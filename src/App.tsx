import React, { FC, useEffect } from "react";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Main: FC = () => {
  const { isLoggedIn } = useAuth();

  const isUserLoggedIn = isLoggedIn || localStorage.getItem("token");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            isUserLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            !isUserLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route path="*" element={<Navigate to={isUserLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: FC = () => {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
};

export default App;
