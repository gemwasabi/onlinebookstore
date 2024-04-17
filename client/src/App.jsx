import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/Libri";
import Ballina from "./faqet/Ballina";
import Navbar from "./komponentet/Navbar";
import Footer from "./komponentet/Footer";
import "./output.css";
import Kerko from "./faqet/Kerko";
import LibratShto from "./faqet/librat/Shto";

const Struktura = () => {
  return (
    <>
      <Kerko></Kerko>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Struktura />,
    children: [
      {
        path: "/",
        element: <Ballina></Ballina>,
      },
      {
        path: "/libri/:id",
        element: <Libri></Libri>,
      },
      // {
      //   path: "/librat/shto",
      //   element: <LibratShto></LibratShto>,
      // },
    ],
  },
  {
    path: "/regjistrohu",
    element: <Regjistrohu />,
  },
  {
    path: "/kycu",
    element: <Kycu />,
  },
  {
    path: "/librat/shto",
    element: <LibratShto></LibratShto>,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
