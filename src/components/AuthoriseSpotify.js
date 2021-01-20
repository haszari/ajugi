import React from "react";

import spotifyApp from "../config/spotify.js";

function AuthoriseSpotify() {
  const spotifyAuthUrl =
    "https://accounts.spotify.com/authorize?response_type=token" +
    `&client_id=${spotifyApp.clientId}` +
    `&redirect_uri=${spotifyApp.redirectUrl}` +
    `&scope=${encodeURIComponent(spotifyApp.scopes)}`;
  // + `&state=${ randomString }`
  return (
    <>
      <p>Click button to authorise with Spotify.</p>
      <a href={spotifyAuthUrl} rel="noopener noreferrer">
        Authorise
      </a>
    </>
  );
}

export default AuthoriseSpotify;
