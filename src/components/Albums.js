import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import store from "../store/store.js";

import { fetchSongs } from "../store/albums";
import { getStatus, getAlbums } from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

import "./Albums.scss";

function Album({ id, albumSongs }) {
  const album = albumSongs[0]?.track?.album;
  if (!album) {
    return null;
  }

  const coverImageUrl = album.images[0]?.url;
  const title = album.name;
  let releaseType = "album";
  if (album.total_tracks < 7) {
    releaseType = album.total_tracks > 3 ? "ep" : "single";
  }

  return <img className={releaseType} src={coverImageUrl} alt={title} />;
}

function Albums() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);
  const albums = useSelector(getAlbums);

  // Start loading songs on mount.
  useEffect(() => {
    store.dispatch(fetchSongs({ spotifyAccessToken }));
  }, [spotifyAccessToken]);

  if (status === "loading") {
    return "Loading songs…";
  }

  if (!albums) {
    return "Grouping albums…";
  }

  const cells = Object.entries(albums).map(([id, albumSongs]) => (
    <Album key={id} id={id} albumSongs={albumSongs} />
  ));

  return <div className="Albums-container">{cells}</div>;
}

export default Albums;
