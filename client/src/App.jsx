import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/librat/Libri";
import Ballina from "./faqet/Ballina";
import Navbar from "./komponentet/Navbar";
import Footer from "./komponentet/Footer";
import "./output.css";
import Kerko from "./faqet/Kerko";
import LibratShto from "./faqet/librat/Shto";
import SidebarAdmin from "./komponentet/admin/Sidebar";
import NavbarAdmin from "./komponentet/admin/Navbar";
import FooterAdmin from "./komponentet/admin/Footer";
import ShtoLiber from "./faqet/admin/Librat/Shto";
import ShfaqLibrat from "./faqet/admin/Librat/Lista";
import ShfaqPerdoruesin from "./faqet/admin/Perdoruesit/Lista";
import ShtoKategori from "./faqet/admin/Kategorite/Shto";
import ShfaqKategorite from "./faqet/admin/Kategorite/Lista";
import EditoLibrin from "./faqet/admin/Librat/Edito";
import EditoKategorine from "./faqet/admin/Kategorite/Edito";

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

const StrukturaAdmin = () => {
  return (
    <div className="wrapper">
      <SidebarAdmin></SidebarAdmin>

      <div className="main">
        <NavbarAdmin></NavbarAdmin>

        <main className="content">
          <div className="container-fluid p-0">
            <Outlet></Outlet>
          </div>
        </main>

        <FooterAdmin></FooterAdmin>
      </div>
    </div>
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
      // {
      //   path: "/libri/:id",
      //   element: <Libri></Libri>,
      // },
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
    path: "/shtoLiber",
    element: <LibratShto></LibratShto>,
  },
  {
    path: "/libri/:id",
    element: <Libri></Libri>,
  },
  {
    path: "/admin",
    element: <StrukturaAdmin />,
    children: [
      {
        path: "/admin/librat/shtoLiber",
        element: <ShtoLiber />,
      },
      {
        path: "/admin/librat/shfaqLibrat",
        element: <ShfaqLibrat />,
      },
      {
        path: "/admin/librat/editoLibrin/:id",
        element: <EditoLibrin />,
      },
      {
        path: "/admin/perdoruesit/shfaqPerdoruesit",
        element: <ShfaqPerdoruesin />,
      },
      {
        path: "/admin/kategorite/shtoKategori",
        element: <ShtoKategori />,
      },
      {
        path: "/admin/kategorite/shfaqKategorite",
        element: <ShfaqKategorite />,
      },
      {
        path: "/admin/kategorite/editoKategorine/:id",
        element: <EditoKategorine />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
