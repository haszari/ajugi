import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import store from "../store/store.js";

import { getApiToken } from "../store/app/selectors";
import { setView } from "../store/app";
import { setPlaylistId } from "../store/albums";
import { fetchPlaylists, setSelectedPlaylistId } from "../store/playlists";
import {
  getPlaylists,
  getSelectedPlaylistId,
} from "../store/playlists/selectors";

function Playlists() {
  const apiToken = useSelector(getApiToken);
  const playlists = useSelector(getPlaylists);
  const selectedPlaylistId = useSelector(getSelectedPlaylistId);

  // If there are no playlists, dispatch load action.
  useEffect(() => {
    if (playlists.length > 0 || !apiToken) {
      return;
    }
    store.dispatch(fetchPlaylists({ spotifyAccessToken: apiToken }));
  }, [apiToken, playlists]);

  const showPlaylistImporter = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        store.dispatch(setView({ view: "playlist-importer" }));
      }}
    >
      Or… create a playlist from text
    </Button>
  );

  const showPlaylistAsAlbums = selectedPlaylistId ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        store.dispatch(setPlaylistId({ playlistId: selectedPlaylistId }));
        store.dispatch(setView({ view: "albums" }));
      }}
    >
      Show albums in selected playlist
    </Button>
  ) : null;

  const showPlaylistAsGrid = selectedPlaylistId ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        store.dispatch(setPlaylistId({ playlistId: selectedPlaylistId }));
        store.dispatch(setView({ view: "covergrid" }));
      }}
    >
      Show playlist as grid
    </Button>
  ) : null;

  return (
    <>
      <List className="primary">
        {playlists?.map((playlist) => (
          <ListItem
            key={playlist.id}
            selected={selectedPlaylistId === playlist.id}
            onClick={() => {
              store.dispatch(
                setSelectedPlaylistId({ selectedPlaylistId: playlist.id })
              );
            }}
          >
            {playlist.name}
          </ListItem>
        ))}
      </List>
      {showPlaylistAsAlbums}
      {showPlaylistAsGrid}
      <p>{showPlaylistImporter}</p>
    </>
  );
}

export default Playlists;
