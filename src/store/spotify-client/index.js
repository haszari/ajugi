import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "spotifyClient",
  initialState: {
    apiToken: "",
  },
  reducers: {
    setApiToken(state, action) {
      state.apiToken = action.payload.apiToken;
    },
  },
});

const clearStaleApiToken = () => setApiToken({ apiToken: "" });

const { actions, reducer } = slice;
const { setApiToken } = actions;

export { clearStaleApiToken, setApiToken };
export default reducer;
