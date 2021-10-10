import React, { useEffect } from "react";

import { shuffle } from "lodash";

import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";

import classnames from "classnames";

import { playItem } from "../lib/spotify-api";

import store from "../store/store.js";

import { fetchSongs, setSelectedAlbumId } from "../store/albums";
import {
  getStatus,
  getAlbums,
  getSelectedAlbumId,
} from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

import CBRMixerLogo from "./CBRMixerLogo";
import "./Albums.scss";

function CoverGridItem({ coverComponent }) {
  return (
    <div className={classnames("release", "ep")}>
      { coverComponent }
    </div>
  );
}


function Album({ id, albumSongs, isSelected }) {
  const album = albumSongs[0]?.track?.album;
  if (!album) {
    return null;
  }

  const coverImageUrl = album.images[0]?.url;

  const coverComponent = ( <img src={coverImageUrl} alt="" /> );

  return ( 
    <CoverGridItem 
      coverComponent={ coverComponent }
      />
  );
}

function Albums() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);
  const selectedAlbumId = useSelector(getSelectedAlbumId);
  let albums = useSelector(getAlbums);

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
    <Album
      key={id}
      id={id}
      albumSongs={albumSongs}
      isSelected={id === selectedAlbumId}
    />
  ));

  cells.push( (
    <div className="release ep">
      <CBRMixerLogo />
      </div>
  ) );

  const shuffled = shuffle( cells );

  return <div className="Albums-container">{shuffled}</div>;
}

export default Albums;
