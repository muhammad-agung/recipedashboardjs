import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for redirection
import {Avatar, Button, CssBaseline, TextField, Box, Typography, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const defaultTheme = createTheme();

export default function SignIn() {
  const [loggedIn, setLoggedIn] = useState(false); // State to track if user is logged in
  const navigate = useNavigate(); // Hook to manage navigation history

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true); // If user is logged in, set loggedIn to true
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const data = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(auth, data.get('email'), data.get('password'));
    } catch (error) {
      console.error(error.message);
      alert("Invalid email or password");
    }
  };

  // If user is logged in, redirect to the homepage
  if (loggedIn) {
    navigate('/'); // Replace '/homepage' with the route to your homepage
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
