import React, { useState, useEffect } from "react";


import AuthoriseSpotify from "./AuthoriseSpotify.js";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

import useUrlHashParams from "../lib/useUrlHashParams.js";

function Playlists() {
  const { access_token: spotifyAccessToken } = useUrlHashParams();

  const [ playlists, setPlaylists ] = useState( [] );

  // If playlists are empty, fetch em.
  // This is basically a demo/temporary.
  useEffect( () => {
    if ( playlists.length > 0 || ! spotifyAccessToken ) { return };

    spotifyFetch( {
      spotifyAccessToken, 
      url: baseUrl + 'me/playlists',
    } ).then( response => {
      console.log( response.items );
      setPlaylists( response.items );
    } );  
  }, [ spotifyAccessToken, playlists, setPlaylists ] );

  if ( ! spotifyAccessToken ) {
    return (<AuthoriseSpotify />);
  }

  return (
    <>
      {
        playlists.map( ( playlist ) => (
          <div key={ playlist.id }>{ playlist.name }</div>
        ) )
      }
    </>
  );
}

export default Playlists;
