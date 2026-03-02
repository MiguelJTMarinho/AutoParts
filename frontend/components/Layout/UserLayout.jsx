import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

const userLayout = () => {
  return (
    <>
      {/*Header*/}
      <Header />
      {/*Main Component*/}
      <main>
        <Outlet />
      </main>
      {/*Footer*/}
      <Footer />
    </>
  );
};

export default userLayout;
