import React from "react";

import { useSelector } from "react-redux";

import { getApiToken } from "../store/app/selectors";

function PlaylistImporter() {
  const apiToken = useSelector(getApiToken);

  return (
    <>
      <h1>make a playlist from text</h1>
    </>
  );
}

export default PlaylistImporter;
