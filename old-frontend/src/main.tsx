import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import { ThemeProvider } from "@mui/material";
import globalTheme from "./theme.ts";
import InvestigatePage from "./pages/Investigate/index";
import { QueryClient, QueryClientProvider } from "react-query";
import DatabasePage from "./pages/Database/index";
import { SnackbarProvider } from "notistack";
import LoginLayout from "./layouts/LoginLayout.tsx";
import LoginPage from "./pages/Login/index";
import AuthGuard from "./guards/AuthGuard.tsx";
import LogoutPage from "./pages/Logout.tsx";
import { CasesPage } from "./pages/Cases/index";
import { SocialMediaDatabasePage } from "./pages/SocialMediaDatabase/index";
import { SocialMediaDashboardPage } from "./pages/SocialMediaDashboard/index";
import { ViewCasePage } from "./pages/ViewCase/index";
import { DashboardIndexPage } from "./pages/DashboardIndex.tsx";
import ModelInferencePage from './pages/ModelInference/index.tsx';
import DashboardPage from './pages/Dashboard/index.tsx';

import { SearchProvider } from './common/SearchContext.tsx';


const queryClient = new QueryClient();


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
  {
    path: '/logout',
    element: <LogoutPage />,
  },
  {
    path: '/login',
    element: <LoginLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      }
    ]
  },
  {
    path: '/dashboard',
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
        path: '/dashboard/url/investigate',
        element: <InvestigatePage />,
      },
      {
        path: '/dashboard/url/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/dashboard/url/model-inference',
        element: <ModelInferencePage />,
      },
      {
        path: '/dashboard/url/database',
        element: <DatabasePage />,
      },
      {
        path: '/dashboard/cases',
        element: <CasesPage />,
      },
      {
        path: '/dashboard/cases/:caseId',
        element: <ViewCasePage />,
      },
      {
        path: '/dashboard/social-media/home',
        element: <SocialMediaDashboardPage />,
      },
      {
        path: '/dashboard/social-media/database',
        element: <SocialMediaDatabasePage />,
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <SnackbarProvider>
    <ThemeProvider theme={globalTheme}>
      <QueryClientProvider client={queryClient}>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </SnackbarProvider>
  //</React.StrictMode>,
)
