import { createSlice } from "@reduxjs/toolkit";
import { groupBy } from "lodash";

import { spotifyFetch, playlistUrl } from "../../lib/spotify-api";

import { getPlaylistId, getPagination } from "./selectors";

const appSlice = createSlice({
  name: "albums",
  initialState: {
    playlistId: "", // Interested
    status: "idle",
    pagination: {
      offset: 0,
      limit: 100,
    },
    // albums, keyed by spotify id
    albums: {},
    selectedAlbumId: "",
  },
  reducers: {
    setPlaylistId(state, action) {
      state.playlistId = action.payload.playlistId;
      // reset pagination, song list
      state.pagination = {
        offset: 0,
        limit: 100,
      };
      state.songs = [];
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    songsReceived(state, action) {
      state.songs.push(...action.payload.items);
      const { limit, offset } = action.payload;
      state.pagination = {
        limit,
        offset,
      };
    },
    showAlbums(state, action) {
      state.albums = groupBy(state.songs, (song) => song?.track?.album?.id);
    },
    setSelectedAlbumId(state, action) {
      state.selectedAlbumId = action.payload;
    },
  },
});

const { actions, reducer } = appSlice;
const {
  setPlaylistId,
  setStatus,
  setSelectedAlbumId,
  songsReceived,
  showArtists,
  showAlbums,
} = actions;

const fetchSongs = ({ spotifyAccessToken }) => async (dispatch, state) => {
  dispatch(setStatus("loading"));

  const current = state();
  const playlistId = getPlaylistId(current);
  const pagination = getPagination(current);

  try {
    let url = playlistUrl({ spotifyAccessToken, playlistId, ...pagination }),
      response;
    do {
      response = await spotifyFetch({ spotifyAccessToken, url });
      dispatch(
        songsReceived({
          items: response.items,
          offset: response.offset + response.limit,
          limit: response.limit,
        })
      );
      url = response.next;
    } while (url);
  } catch (error) {
    console.log(error);
  }

  dispatch(setStatus("loaded"));

  dispatch(showAlbums());
};

export {
  setPlaylistId,
  setStatus,
  songsReceived,
  setSelectedAlbumId,
  showArtists,
  showAlbums,
  fetchSongs,
};
export default reducer;
