import {Box, Toolbar} from '@mui/material';
import Sidebar from '../components/Sidebar';
import {Outlet} from 'react-router-dom';
import MainAppBar, {APPBAR_HEIGHT} from "../components/MainAppBar";
import {useEffect, useState} from "react";

export default function MainLayout() {
  const [fadeState, setFadeState] = useState(0);

  useEffect(() => {
    setFadeState(0);
    setTimeout(() => {
      setFadeState(1);
    }, 10);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        transition: 'filter 0.25s ease-in-out',
        filter: fadeState === 0 ? 'blur(10px)': 'blur(0px)',
      }}
    >
      <Sidebar/>

      <MainAppBar/>

      <Box sx={{flexGrow: 1}}>
        <Toolbar sx={{height: APPBAR_HEIGHT}}/>

        <Box
          sx={{
            position: 'relative',
            height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
            background: 'linear-gradient(#000000, #004083)',
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, boxSizing: 'border-box', overflow: 'auto' }}>
            <Outlet/>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
