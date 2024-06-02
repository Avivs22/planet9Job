import React from 'react';
import './styles.css';
import { Button, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useGetRedirectInfoQuery } from '../../common/api';
import CountryFlag from '../CountryFlag';
import { clickedButtonIndexAtom } from '../../common/state';
import { useAtomValue, useSetAtom } from 'jotai';

const redirectButtonStyle = {
    padding: "2rem",
    paddingLeft:"11rem",
    paddingRight:"11rem",
    marginRight: "1rem", 
    display: 'flex',
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    border: "1px solid #ccc", 
    borderWidth: 2,
    borderRadius: "25px",
    backgroundColor: "rgba(70, 70, 70, 0.5)",
    color: '#bbbbbb',
    height: "12rem",
    fontSize: "1rem"
};

const redirectButtonStyleClicked = {
    ...redirectButtonStyle,
    backgroundColor: "rgba(128, 128, 128, 0.5)", // Change to your desired clicked color
    color: 'white' // Change text color if needed
};

type RedirectInfo = {
    url: string;
    enviroment: string;
    depth: number;
    idx: number;
    reason: number;
    ip: string;
};

type RedirectBarComponentParams = {
    scan_uuid: string;
    enviroment: string;
}

const RedirectBar: React.FC = () => {
    const { scan_uuid, enviroment } = useParams<RedirectBarComponentParams>();
    const { data: redirectData, isLoading: isRedirectLoading } = useGetRedirectInfoQuery<RedirectInfo[]>({ scan_uuid, enviroment });
    const clickedIndex = useAtomValue(clickedButtonIndexAtom);
    const setClickedIndex = useSetAtom(clickedButtonIndexAtom);

    if (isRedirectLoading) {
        return <Typography>Loading...</Typography>
    }
    if (!Array.isArray(redirectData)) {
        return <Typography>No redirect data available</Typography>;
    }
    const handleButtonClick = (index: number) => {
        setClickedIndex(index);
    };

    return (
        <div className="redirect-container">
    {redirectData && redirectData.map((item, index) => (
        <React.Fragment key={index}>
            <Button
                className="redirect-block" // Add the redirect-block class to each block
                sx={{ textTransform: 'none'}}
                style={index === clickedIndex ? redirectButtonStyleClicked : redirectButtonStyle}
                onClick={() => handleButtonClick(index)}
            >
                <span>{item.url}</span>
                <CountryFlag ip={item.ip}/>
            </Button>
            {index !== redirectData.length - 1 && <ArrowForward style={{ marginRight: '10px' }} />} {/* Add ArrowForward except for the last item */}
        </React.Fragment>
    ))}
</div>

    );
};

export default RedirectBar;
