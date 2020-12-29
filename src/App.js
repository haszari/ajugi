import React, { useEffect } from "react";

import { Provider, useSelector } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import theme from "./theme";

import store from "./store/store.js";
import { setApiToken } from "./store/app";
import { getApiToken } from "./store/app/selectors";

import AuthoriseSpotify from "./components/AuthoriseSpotify.js";
import Playlists from "./components/Playlists.js";

import useUrlHashParams from "./lib/useUrlHashParams.js";

// Main application content component.
// Logic for determining what view to show (e.g. auth or playlists).
function AppContent() {
  // Wrangle our API token.
  // The token is delivered from Spotify API via `#access_token` url param.
  // We store it in our redux state.
  // We use an effect to persist the token to local storage, or use a
  // previously-saved token, by dispatching action to update store.
  const { access_token: urlApiToken } = useUrlHashParams();
  const apiToken = useSelector(getApiToken);

  useEffect(() => {
    const savedApiToken = window.localStorage.getItem("apiToken");
    if (urlApiToken && savedApiToken !== urlApiToken) {
      // New token in URL - persist to storage for next time.
      window.localStorage.setItem("apiToken", urlApiToken);
      store.dispatch(setApiToken({ apiToken: urlApiToken }));
    } else {
      // No new token - use the saved one.
      store.dispatch(setApiToken({ apiToken: savedApiToken }));
    }
  }, [urlApiToken]);

  if (!apiToken) {
    return <AuthoriseSpotify />;
  }

  return <Playlists />;
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
