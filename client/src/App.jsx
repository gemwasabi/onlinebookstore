import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
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
import EditoLibrin from "./faqet/admin/Librat/Edito";

import ShtoPerdorues from "./faqet/admin/Perdoruesit/Shto";
import ShfaqPerdoruesin from "./faqet/admin/Perdoruesit/Lista";
import EditoPerdoruesin from "./faqet/admin/Perdoruesit/Edito";

import ShtoKategori from "./faqet/admin/Kategorite/Shto";
import ShfaqKategorite from "./faqet/admin/Kategorite/Lista";
import EditoKategorine from "./faqet/admin/Kategorite/Edito";

const Struktura = () => {
  return (
    <>
      <Kerko />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const StrukturaAdmin = () => {
  return (
    <div className="wrapper">
      <SidebarAdmin />
      <div className="main">
        <NavbarAdmin />
        <main className="content">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
        <FooterAdmin />
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
        element: <Ballina />,
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
  {
    path: "/shtoLiber",
    element: <LibratShto />,
  },
  {
    path: "/libri/:id",
    element: <Libri />,
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
        path: "/admin/perdoruesit/shtoPerdorues",
        element: <ShtoPerdorues />,
      },
      {
        path: "/admin/perdoruesit/shfaqPerdoruesit",
        element: <ShfaqPerdoruesin />,
      },
      {
        path: "/admin/perdoruesit/editoPerdoruesin/:id",
        element: <EditoPerdoruesin />,
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
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
};

export default App;