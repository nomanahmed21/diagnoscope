// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/UserPage", {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(setUser(data.user)); // store user in Redux
          setIsAuthenticated(true);
        } else {
          dispatch(clearUser()); // clear Redux if token expired/invalid
          setIsAuthenticated(false);
        }
      } catch (err) {
        dispatch(clearUser());
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // optional loader
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
