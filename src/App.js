import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import theme from "./theme";

import store from "./store/store.js";

import AuthoriseSpotify from "./components/AuthoriseSpotify.js";
import Playlists from "./components/Playlists.js";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Router>
          <Provider store={store}>
            <Switch>
              <Route path="/callback" children={<Playlists />} />
              <Route path="/" children={<AuthoriseSpotify />} />
            </Switch>
          </Provider>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
