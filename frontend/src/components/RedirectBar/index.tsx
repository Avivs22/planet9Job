import React, { useState } from 'react';
import './styles.css';
import { Button, Grid, Typography } from '@mui/material';
import { ArrowForward, Download } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useGetRedirectInfoQuery } from '../../common/api';
import CountryFlag from '../CountryFlag';

const redirectButtonStyle = {
    padding: "10px",
    marginRight: "10px", 
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    border: "1px solid #ccc", 
    borderWidth: 2,
    borderRadius: "25px",
    backgroundColor: "rgba(128, 128, 128, 0.5)",
    color: 'white',
    height: "100px",
    width: "250px",
    fontSize: "18px"
};

const redirectButtonStyleClicked = {
    ...redirectButtonStyle,
    backgroundColor: "rgba(0, 128, 128, 0.5)", // Change to your desired clicked color
    color: 'yellow' // Change text color if needed
};

type RedirectInfo = {
    url: string;
    raw_input: string;
    scan_uuid: string;
    enviroment: string;
};

interface RedirectBarComponentParams {
    scan_uuid: string;
    enviroment: string;
}

const RedirectBar = () => {
    const { scan_uuid, enviroment } = useParams<RedirectBarComponentParams>();

    // TODO ask ohad how to properly pass/use "refreshInterval" so it will change here as user click
    const { data, isLoading } = useGetRedirectInfoQuery<RedirectInfo[]>({ scan_uuid, enviroment });
    
    const [isClicked, setIsClicked] = useState([false, false]);

    const handleButtonClick = (index: number) => {
        setIsClicked(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };


  return (
    <div className="redirect-container">
        <Button sx={{ textTransform: 'none' }} style={isClicked[0] ? redirectButtonStyleClicked : redirectButtonStyle} onClick={() => handleButtonClick(0)}>
            <span>https://facebook.com</span>
            <CountryFlag ip='214.153.8.0'/>
        </Button>
        <ArrowForward style={{ marginRight: '10px' }} />
        <Button sx={{ textTransform: 'none' }} style={isClicked[1] ? redirectButtonStyleClicked : redirectButtonStyle} onClick={() => handleButtonClick(1)}>
            <span>https://facebook.com</span>
            <CountryFlag ip='214.153.8.0'/>
        </Button>
    </div>
  );
};

export default RedirectBar;
