import { createBrowserRouter } from "react-router-dom";

import CoreLayout from "@/views/Core/Sidebar/Layout";

import MainPage from "@/views/MainPage/MainPage";

import Login from "@/views/Login/Login";
import Register from "@/views/Register/Register";

import NotFound from "@/views/Error/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CoreLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },

      // {
      //   path: "/crypto-trading",
      //   element: <CryptoTranding />,
      // },
      // {
      //   path: "/nft",
      //   element: <NFTAlbum />,
      // },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
