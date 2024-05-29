import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/librat/Libri";
import Ballina from "./faqet/Ballina";
import Navbar from "./komponentet/Navbar";
import Footer from "./komponentet/Footer";
import Librii from "./faqet/Librii";
import "./output.css";
/*import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";*/
import Kerko from "./faqet/Kerko";
import LibratShto from "./faqet/librat/Shto";
import SidebarAdmin from "./komponentet/admin/Sidebar";
import NavbarAdmin from "./komponentet/admin/Navbar";
import FooterAdmin from "./komponentet/admin/Footer";

import CheckoutPage from "./faqet/checkout/checkout-1";

import ShtoLiber from "./faqet/admin/Librat/Shto";
import ShfaqLibrat from "./faqet/admin/Librat/Lista";
import EditoLibrin from "./faqet/admin/Librat/Edito";

import ShtoPerdorues from "./faqet/admin/Perdoruesit/Shto";
import ShfaqPerdoruesin from "./faqet/admin/Perdoruesit/Lista";
import EditoPerdoruesin from "./faqet/admin/Perdoruesit/Edito";

import ShtoKategori from "./faqet/admin/Kategorite/Shto";
import ShfaqKategorite from "./faqet/admin/Kategorite/Lista";
import EditoKategorine from "./faqet/admin/Kategorite/Edito";

import Tufat from "./faqet/admin/Tufat/Lista";
import TufatShto from "./faqet/admin/Tufat/Shto";
import TufatEdito from "./faqet/admin/Tufat/Edito";


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

const StrukturaNormale = () => {
  return (
    <>
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
      {
        path: "/libri/:id",
        element: <Libri />,
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
      {
        path: "/admin/tufat",
        element: <Tufat />,
      },
      {
        path: "/admin/editoTufen/:id",
        element: <TufatEdito />,
      },
      {
        path: "/admin/shtoTufe",
        element: <TufatShto />,
      },
    ],
  },
  {
    path: "/",
    element: <StrukturaNormale />,
    children: [
      {
        path: "/checkout",
        element: <CheckoutPage />,
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