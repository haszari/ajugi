import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

import { useSelector } from "react-redux";

import useUrlHashParams from "../lib/useUrlHashParams.js";

import {
  getPlaylistId,
  getLoading,
  getGroups,
  getSongs,
  getView,
} from "../store/app/selectors.js";
import {
  setPlaylistId,
  showArtists,
  showAlbums,
  fetchSongs,
} from "../store/app/slice.js";
import store from "../store/store";

import SongTable from "./SongTable.js";
import ArtistTable from "./ArtistTable.js";
import AlbumTable from "./AlbumTable.js";

function SongList() {
  const { access_token: spotifyAccessToken } = useUrlHashParams();

  const playlistId = useSelector(getPlaylistId);
  const loadingState = useSelector(getLoading);
  const viewMode = useSelector(getView);
  const songs = useSelector(getSongs);
  const groups = useSelector(getGroups);

  const loadPlaylistForm =
    loadingState === "idle" ? (
      <Box my={3}>
        <TextField
          id="filled-basic"
          label="Playlist ID"
          variant="filled"
          value={playlistId}
          onChange={(event) =>
            store.dispatch(setPlaylistId(event.target.value))
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => store.dispatch(fetchSongs({ spotifyAccessToken }))}
        >
          Load songs
        </Button>
      </Box>
    ) : null;

  const groupingForm =
    loadingState === "loaded" ? (
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => store.dispatch(showAlbums())}
        >
          Show albums
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => store.dispatch(showArtists())}
        >
          Show artists
        </Button>
      </Box>
    ) : null;

  const list =
    viewMode === "songs" ? (
      <SongTable songs={songs} />
    ) : viewMode === "artists" ? (
      <ArtistTable groups={groups} />
    ) : viewMode === "albums" ? (
      <AlbumTable groups={groups} />
    ) : null;

  return (
    <>
      {loadPlaylistForm}
      {groupingForm}
      {list}
    </>
  );
}

export default SongList;
