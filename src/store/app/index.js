import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "spotifyClient",
  initialState: {
    apiToken: "",
    view: "playlists",
  },
  reducers: {
    setApiToken(state, action) {
      state.apiToken = action.payload.apiToken;
    },
    setView(state, action) {
      state.view = action.payload.view;
    },
  },
});

const clearStaleApiToken = () => setApiToken({ apiToken: "" });

const { actions, reducer } = slice;
const { setApiToken, setView } = actions;

export { clearStaleApiToken, setApiToken, setView };
export default reducer;
