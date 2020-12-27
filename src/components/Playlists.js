import React, { useState, useEffect } from "react";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

// temporarily pass token as a prop
function Playlists({ spotifyAccessToken }) {
  const [playlists, setPlaylists] = useState([]);

  // If playlists are empty, fetch em.
  // This is basically a demo/temporary.
  useEffect(() => {
    if (playlists.length > 0 || !spotifyAccessToken) {
      return;
    }

    spotifyFetch({
      spotifyAccessToken,
      url: baseUrl + "me/playlists",
    }).then((response) => {
      console.log(response.items);
      setPlaylists(response.items);
    });
  }, [spotifyAccessToken, playlists, setPlaylists]);

  return (
    <>
      {playlists.map((playlist) => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </>
  );
}

export default Playlists;
