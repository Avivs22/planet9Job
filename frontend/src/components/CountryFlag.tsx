// src/components/CountryFlag.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactCountryFlag from 'react-country-flag';

const CountryFlag = ({ ip }) => {
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        setCountryCode(response.data.country_code);
      } catch (error) {
        console.error('Error fetching country code:', error);
      }
    };

    fetchCountryCode();
  }, [ip]);

  return (
    <div>
      {countryCode ? (
        <div style={{ display: 'flex' }}>
            <ReactCountryFlag countryCode={countryCode} svg style={{ fontSize: '2em' }} />
            <span style={{ marginLeft: '10px' }}>{ip}</span>
        </div>
        ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CountryFlag;
