import {Alert, Box, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";

import logoImage from '../../assets/images/p9_logo.svg';
import {LoadingButton} from "@mui/lab";
import axios from "axios";
import {useSetAtom} from "jotai";
import {loggedInAtom, loginStateAtom, tokenStorageAtom} from "../../state/ui.ts";


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    setPwd('');
  }, []);

  const updateLoggedIn = useSetAtom(loggedInAtom);
  const updateLoginState = useSetAtom(loginStateAtom);
  const updateToken = useSetAtom(tokenStorageAtom);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handeLogin = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = (await axios.post('/api/login', {username, password: pwd})).data as { token: string };
      let token = result.token;
      if (token.startsWith('"'))
        token = token.substring(1, token.length - 1);

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      updateLoginState(1);
      updateLoggedIn(true);
      updateToken(token);

      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: 400,
      }}
    >
      <img
        src={logoImage}
        style={{
          display: 'table',
          margin: '0 auto',
          marginBottom: 48,
        }}
      />

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            background: '#73737345 !important',
          }}
        >
          Wrong password, please try again.
        </Alert>
      )}

      <TextField
        label="Username"
        fullWidth
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{mb: 3}}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        sx={{mb: 3}}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handeLogin().then();
          }
        }}
      />

      <LoadingButton
        onClick={handeLogin}
        loading={loading}
        variant="contained"
        sx={{
          display: 'table',
          margin: '0 auto',
        }}
      >
        Sign in
      </LoadingButton>
    </Box>
  )
}
