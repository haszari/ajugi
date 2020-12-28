import { createSlice } from "@reduxjs/toolkit";

import { baseUrl, spotifyFetch } from "../../lib/spotify-api";

const slice = createSlice({
  name: "playlists",
  initialState: {
    status: "idle",
    playlists: [],
    selectedPlaylistId: "",
  },
  reducers: {
    setStatus(state, action) {
      state.status = action.payload.status;
    },
    playlistsReceived(state, action) {
      state.playlists.push(...action.payload.items);
    },
    setSelectedPlaylistId(state, action) {
      state.selectedPlaylistId = action.payload.selectedPlaylistId;
    },
  },
});

const fetchPlaylists = ({ spotifyAccessToken }) => async (dispatch, state) => {
  dispatch(setStatus("loading"));

  try {
    let url = baseUrl + "me/playlists";

    let response = await spotifyFetch({ spotifyAccessToken, url });
    dispatch(
      playlistsReceived({
        items: response.items,
      })
    );
  } catch (error) {
    console.log(error);
  }

  dispatch(setStatus("loaded"));
};

const { actions, reducer } = slice;
const { setStatus, playlistsReceived, setSelectedPlaylistId } = actions;

export { playlistsReceived, fetchPlaylists, setSelectedPlaylistId };
export default reducer;
