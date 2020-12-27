import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "spotifyClient",
  initialState: {
    apiToken: "",
  },
  reducers: {
    setApiToken(state, action) {
      state.apiToken = action.apiToken;
    },
  },
});

const { actions, reducer } = slice;
const { setApiToken } = actions;

export { setApiToken };
export default reducer;
