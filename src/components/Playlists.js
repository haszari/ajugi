import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import store from "../store/store.js";

import { getApiToken } from "../store/app/selectors";
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

  return (
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
  );
}

export default Playlists;
