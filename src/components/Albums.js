import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";

import classnames from "classnames";

import store from "../store/store.js";

import { fetchSongs, setSelectedAlbumId } from "../store/albums";
import {
  getStatus,
  getAlbums,
  getSelectedAlbumId,
} from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

import "./Albums.scss";

function Album({ id, albumSongs, isSelected }) {
  const album = albumSongs[0]?.track?.album;
  if (!album) {
    return null;
  }

  const artist = album?.artists[0]?.name;
  const title = album.name;
  const releaseDate = album.release_date;
  const coverImageUrl = album.images[0]?.url;
  let releaseType = "album";
  if (album.total_tracks < 7) {
    releaseType = album.total_tracks > 3 ? "ep" : "single";
  }

  const onCoverClick = () => {
    if (isSelected) {
      store.dispatch(setSelectedAlbumId(""));
    } else {
      store.dispatch(setSelectedAlbumId(id));
    }
  };

  const playAlbum = () => {
    console.log("tbp");
  };

  const infoBox = isSelected ? (
    <div className="info">
      <div className="artist">{artist}</div>
      <div className="title">{title}</div>
      <div className="releaseDate">{releaseDate}</div>

      <Button variant="contained" color="primary" onClick={playAlbum}>
        Play
      </Button>
    </div>
  ) : null;

  return (
    <div className={classnames("release", releaseType, { isSelected })}>
      <img onClick={onCoverClick} src={coverImageUrl} alt={title} />
      {infoBox}
    </div>
  );
}

function Albums() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);
  const selectedAlbumId = useSelector(getSelectedAlbumId);
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
    <Album
      key={id}
      id={id}
      albumSongs={albumSongs}
      isSelected={id === selectedAlbumId}
    />
  ));

  return <div className="Albums-container">{cells}</div>;
}

export default Albums;
