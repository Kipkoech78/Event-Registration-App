import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "./components/ui/button";
import ExhibitionHome from "./pages/exhibition-view/ExhibitionHome";
import AuthLayout from "./components/auth/AuthLayout";
import CheckAuth from "./components/common/CheckAuth";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin-view/AdminLayout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import ExhibitionLayout from "./components/exhibition-view/ExhibitionLayout";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import { PageSkeleton } from "./components/common/Skeleton";
import AdminEventsTile from "./components/admin-view/eventsTile";
import AdminEvents from "./pages/admin-view/events";
import EventListing from "./pages/exhibition-view/listing";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  console.log("user info", user);
  console.log("Authentication", isAuthenticated);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  console.log("Check if loading", isLoading);
  if (isLoading) return <PageSkeleton />;
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <ExhibitionHome />
            // <CheckAuth
            //   isAuthenticated={isAuthenticated}
            //   user={user}
            // ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
        </Route>
        <Route
          path="/exhibition"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ExhibitionLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ExhibitionHome />} />
          <Route path="listing" element={<EventListing />} />
          
        </Route>
        <Route path="*" element={<p> No page recreate</p>} />
        <Route
          path="unauth-page"
          element={
            <p>
              Not authenticated .. later Linus create file to render the page
              now is just a p tag element{" "}
            </p>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
