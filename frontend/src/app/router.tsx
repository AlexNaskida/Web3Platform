import { createBrowserRouter } from "react-router-dom";

// import AuthLayout from "@/views/Auth/Layout";
import CoreLayout from "@/views/Core/Sidebar/Layout";

import MainPage from "@/views/MainPage/MainPage";

import Login from "@/views/Auth/Login";
import Register from "@/views/Auth/Register";

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
  // {
  //   path: "/login",
  //   element: <AuthLayout />,
  //   errorElement: <NotFound />,
  //   children: [{ index: true, element: <Login /> }],
  // },
  // {
  //   path: "/register",
  //   element: <AuthLayout />,
  //   errorElement: <NotFound />,
  //   children: [{ index: true, element: <Register /> }],
  // },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />,
  },
]);

export default router;
