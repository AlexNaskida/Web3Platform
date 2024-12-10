import { createBrowserRouter } from "react-router-dom";

// import AuthLayout from "@/views/Auth/Layout";
import CoreLayout from "@/views/Core/Sidebar/Layout";

import MainPage from "@/views/MainPage/MainPage";

import MainNFTPage from "@/views/MainNFT/MainNFTPage";

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
      {
        path: "/nft",
        element: <MainNFTPage />,
        // element: <NFTAlbum />,
      },
      // {
      //   path: "/crypto-trading",
      //   element: <CryptoTranding />,
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
]);

export default router;
