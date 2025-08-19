import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import LeftBar from "../components/LeftBar";

const MainLayout = () => {
  const [searchOpen, setSearchOpen] = useState("");
  const [activeTab, setActiveTab] = useState("");
  return (
    <div className="flex flex-row w-full h-screen ">
      <LeftBar />
      <Sidebar
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1  p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
