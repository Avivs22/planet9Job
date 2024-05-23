import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import { ThemeProvider } from "@mui/material";
import globalTheme from "./theme.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { SearchProvider } from './common/SearchContext.tsx';

import LoginLayout from "./layouts/LoginLayout.tsx";
import LoginPage from "./pages/Login/index";
import UploadPage from "./pages/Upload/index.tsx";
import AuthGuard from "./guards/AuthGuard.tsx";

import LogoutPage from "./pages/Logout.tsx";

import { DashboardIndexPage } from "./pages/DashboardIndex.tsx";
import SearchPage from "./pages/Search/index.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AuthGuard>
         <MainLayout />
      // </AuthGuard>
     ),
     children: [
       {
         index: true,
         element: <DashboardIndexPage />,
       },
       {
        path: "/upload",
        element: <UploadPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
     ]
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  }
  ,
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <SnackbarProvider>
    <ThemeProvider theme={globalTheme}>
      <QueryClientProvider client={queryClient}>
      <SearchProvider>

        <RouterProvider router={router} />
        </SearchProvider>

      </QueryClientProvider>
    </ThemeProvider>
  </SnackbarProvider>,
  //</React.StrictMode>,
);
