import React from "react";
import ExhibitionHeader from "./header";
import { Outlet } from "react-router-dom";

function ExhibitionLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common Header Components */}
      <ExhibitionHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ExhibitionLayout;
