import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import store from "../store/store.js";

import { fetchSongs } from "../store/albums";
import { getStatus, getAlbums } from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
}));

function Album({ id, albumSongs }) {
  const album = albumSongs[0]?.track?.album;
  if (!album) {
    return null;
  }

  const coverImageUrl = album.images[0].url;
  const title = album.name;

  return (
    <GridListTile key={id} cols={1}>
      <img src={coverImageUrl} alt={title} />
    </GridListTile>
  );
}

function Albums() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);
  const albums = useSelector(getAlbums);

  const classes = useStyles();

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

  return Object.entries(albums).map(([id, albumSongs]) => (
    <GridList cellHeight={160} className={classes.gridList} cols={3}>
      <Album key={id} id={id} albumSongs={albumSongs} />
    </GridList>
  ));
}

export default Albums;
