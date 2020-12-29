import { createSlice } from "@reduxjs/toolkit";
import { groupBy } from "lodash";

import { spotifyFetch, playlistUrl } from "../../lib/spotify-api";

import { getPlaylistId, getPagination } from "./selectors";

const appSlice = createSlice({
  name: "albums",
  initialState: {
    playlistId: "", // Interested
    loading: "idle",
    pagination: {
      offset: 0,
      limit: 100,
    },
    groups: [],
  },
  reducers: {
    setPlaylistId(state, action) {
      state.playlistId = action.payload;
      // reset pagination, song list
      state.pagination = {
        offset: 0,
        limit: 100,
      };
      state.songs = [];
    },
    startLoading(state, action) {
      state.loading = "loading";
    },
    finishLoading(state, action) {
      state.loading = "loaded";
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
      state.groups = groupBy(state.songs, (song) => song?.track?.album?.id);
      state.view = "albums";

      // get cover art in ..
      // song?.track?.album?.images[0].url
      // or sort images by image.size - probably always biggest in [0] though
    },
  },
});

const { actions, reducer } = appSlice;
const {
  setPlaylistId,
  startLoading,
  finishLoading,
  songsReceived,
  showArtists,
  showAlbums,
} = actions;

const fetchSongs = ({ spotifyAccessToken }) => async (dispatch, state) => {
  dispatch(startLoading());

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

  dispatch(finishLoading());
};

export {
  setPlaylistId,
  startLoading,
  finishLoading,
  songsReceived,
  showArtists,
  showAlbums,
  fetchSongs,
};
export default reducer;
