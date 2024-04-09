import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Regjistrohu from "./faqet/Regjistrohu";
import Kycu from "./faqet/Kycu";
import Libri from "./faqet/Libri";
import Ballina from "./faqet/Ballina";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Ballina/>,
  },
  {
    path: "/regjistrohu",
    element: <Regjistrohu/>,
  },
  {
    path: "/kycu",
    element: <Kycu/>,
  },
  {
    path: "/libri",
    element: <Libri/>,
  },
]);

const App = () => {
    return <div>
        <RouterProvider router={router} />
    </div>
};

export default App;
