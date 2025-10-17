import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Root route handling
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      // show homepage for guests
      return children;
    } else {
      // redirect logged in users
      return user?.role === "admin" ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        <Navigate to="/exhibition/home" />
      );
    }
  }
  // Redirect unauthenticated users ONLY when they try to access protected pages
  const protectedPaths = ["/exhibition/checkout", "/exhibition/accounts"];
  if (
    !isAuthenticated &&
    protectedPaths.some((p) => location.pathname.startsWith(p))
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users away from login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/exhibition/home" />
    );
  }

  //   // Prevent regular users from accessing admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Prevent admins from accessing exhibition routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/exhibition")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
