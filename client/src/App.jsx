import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import FAQ from "./faqet/FAQ"; // Import the FAQ component here
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/librat/Libri";
import Ballina from "./faqet/Ballina";
import Navbar from "./komponentet/Navbar";
import Footer from "./komponentet/Footer";
import "./output.css";
/*import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";*/
import Kerko from "./faqet/Kerko";
import Kategoria from "./faqet/Kategoria";
import LibratShto from "./faqet/librat/Shto";
import SidebarAdmin from "./komponentet/admin/Sidebar";
import NavbarAdmin from "./komponentet/admin/Navbar";
import FooterAdmin from "./komponentet/admin/Footer";
import ShikoMeShume from "./komponentet/shikoMeShume";
import Kontakti from "./faqet/Kontakti";
import CheckoutProcess from "./faqet/checkout/CheckoutProcess";
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
import Booksearch from "./komponentet/Booksearch";
import Slider from "./faqet/admin/Slider/Lista";
import SliderShto from "./faqet/admin/Slider/Shto";
import ShfaqPorosite from "./faqet/admin/Porosite/Lista";
import UserSettings from "./faqet/UserSettings";
import UserSettings2 from "./faqet/UserSettings2";

const Struktura = () => {
  return (
    <div>
      <Kerko />
      <Navbar />
      <div className="pt-[0px]">
        <Outlet />
      </div>
      <Footer />
    </div>
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
    path: "/testtest",
    element: <Booksearch />,
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
      {
        path: "/admin/slider",
        element: <Slider />,
      },
      {
        path: "/admin/shtoSlider",
        element: <SliderShto />,
      },
      {
        path: "/admin/shfaqPorosite",
        element: <ShfaqPorosite />,
      },
      {
        path: "/admin/porosia/:id",
        element: <ShfaqPorosite />,
      },
    ],
  },
  {
    path: "/",
    element: <StrukturaNormale />,
    children: [
      {
        path: "/procesimi",
        element: <CheckoutProcess />,
      },
      {
        path: "/libri/:id",
        element: <Libri />,
      },
      {
        path: "/pamjaTufes/:id",
        element: <ShikoMeShume />,
      },
      {
        path: "/kategoria",
        element: <Kategoria />,
      },
      {
        path: "/kontakti",
        element: <Kontakti />,
      },
      {
        path: "/sfondi",
        element: <UserSettings />,
      },
      {
        path: "/sfondi/adresa",
        element: <UserSettings2 />,
      },
      {
        path: "/faq",
        element: <FAQ />,
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
