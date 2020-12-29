// import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { getApiToken } from "../store/app/selectors";
// import { fetchPlaylists, setSelectedPlaylistId } from "../store/albums";
// import {
//   getPlaylists,
//   getSelectedPlaylistId,
// } from "../store/albums/selectors";

function Albums() {
  const apiToken = useSelector(getApiToken);

  return "Albums coming soon";
}

export default Albums;
