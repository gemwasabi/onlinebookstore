import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/Libri";
import Ballina from "./faqet/Ballina";
import Navbar from "./komponentet/Navbar";
import Footer from "./komponentet/Footer";

const Struktura = () => {
  return (
    <>
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
]);

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
};

export default App;
