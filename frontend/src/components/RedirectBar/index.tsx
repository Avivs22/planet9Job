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
    const { data, isLoading } = useGetRedirectInfoQuery<RedirectInfo[]>({ scan_uuid, enviroment });
    console.log(isLoading)
    console.log(data)
    const clickedIndex = useAtomValue(clickedButtonIndexAtom);
    const setClickedIndex = useSetAtom(clickedButtonIndexAtom);

    if (isLoading) {
        return <Typography>Loading...</Typography>
    }

    const handleButtonClick = (index: number) => {
        setClickedIndex(index);
    };

    return (
        <div className="redirect-container">
            {data && data.map((item, index) => (
                <React.Fragment key={index}>
                    <Button
                        sx={{ textTransform: 'none' }}
                        style={index === clickedIndex ? redirectButtonStyleClicked : redirectButtonStyle}
                        onClick={() => handleButtonClick(index)}
                    >
                        <span>{item.url}</span>
                        <CountryFlag ip='214.153.8.0'/>
                    </Button>
                    {index !== data.length - 1 && <ArrowForward style={{ marginRight: '10px' }} />} {/* Add ArrowForward except for the last item */}
                </React.Fragment>
            ))}
        </div>
    );
};

export default RedirectBar;
