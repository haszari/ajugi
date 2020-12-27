import React from "react";

import { Provider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import theme from "./theme";

import store from "./store/store.js";

import AuthoriseSpotify from "./components/AuthoriseSpotify.js";
import Playlists from "./components/Playlists.js";

import useUrlHashParams from "./lib/useUrlHashParams.js";

// Main application content component.
// Logic for determining what view to show (e.g. auth or playlists).
function AppContent() {
  const { access_token: spotifyAccessToken } = useUrlHashParams();

  if (!spotifyAccessToken) {
    return <AuthoriseSpotify />;
  }

  return <Playlists spotifyAccessToken={spotifyAccessToken} />;
}

// Top-level app component with theme, store provider etc.
// Router is used so we can get access to url params via useLocation.
// (We're not actually using any routing, so we can deploy to GitHub Pages.)
function AppContainer() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Router>
          <Provider store={store}>
            <AppContent />
          </Provider>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default AppContainer;
