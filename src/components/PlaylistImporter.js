import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { getApiToken } from "../store/app/selectors";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

const rawPlaylistItems = [
  "Sonny Fodera & Bontan - Always You (Shiba San remix)",
  "Guille Placencia - My Name Is",
  "Popof - Silicone",
  "Armand Van Helden - Summertime",
  "Rhyze - Just How Sweet Is Your Love (Walker & Royce remix)",
  "Eden Burns - Intro Manus",
  "Paranoid London - Eating Glue (ft. Mutado Pintado)",
  "Frankel & Harper - Hydraulic Temperature",
  "Daniel Steinberg - Facelift",
  "Tommy Trash - Slide (Ricky Rae's re-rub)",
  "Tchami & Malaa - The Sermon",
  "Lux Groove - Setup",
  "Peggy Gou - I Go",
  "Marie Davidson - Work It (Soulwax remix)",
  "Robosonic - Worst Love",
  "Qubiko - U R",
];

async function getMyUserId(spotifyAccessToken) {
  let url = new URL(baseUrl + "me");

  let response = await spotifyFetch({
    spotifyAccessToken,
    url,
  });

  console.log(response);

  return response.id;
}

async function createEmptyPlaylist(spotifyAccessToken, userId) {
  let url = new URL(baseUrl + `users/${userId}/playlists`);

  let response = await spotifyFetch({
    spotifyAccessToken,
    url,
    method: "POST",
    body: {
      name: "Ajugi generated " + Math.random(),
    },
  });

  console.log(response);

  return response.id;
}

async function appendTrackToPlaylist(spotifyAccessToken, playlistId, trackId) {
  let url = new URL(baseUrl + `playlists/${playlistId}/tracks`);

  let response = await spotifyFetch({
    spotifyAccessToken,
    url,
    method: "POST",
    body: {
      uris: [trackId],
    },
  });

  console.log(response);

  return response.id;
}

async function searchForFirstHit(spotifyAccessToken, text) {
  let url = new URL(baseUrl + "search");

  // specify artist
  // url.searchParams.append("type", "track");
  // url.searchParams.append("q", "Your Love artist:Frankie Knuckles");

  // just search all text - works well enough
  url.searchParams.append("type", "track");
  url.searchParams.append("q", text);

  let response = await spotifyFetch({ spotifyAccessToken, url });

  return response?.tracks?.items[0]?.uri;
}

async function impogenerateplaylist(spotifyAccessToken) {
  const userId = await getMyUserId(spotifyAccessToken);
  const playlistId = await createEmptyPlaylist(spotifyAccessToken, userId);
  console.log(playlistId);

  for (const text of rawPlaylistItems) {
    const songUri = await searchForFirstHit(spotifyAccessToken, text);
    if (songUri) {
      console.log(`${text} => ${songUri}`);
      await appendTrackToPlaylist(spotifyAccessToken, playlistId, songUri);
    } else {
      console.log(`${text} NOT FOUND!`);
    }
  }
}

function PlaylistImporter() {
  const apiToken = useSelector(getApiToken);

  // If there are no playlists, dispatch load action.
  useEffect(() => {
    if (!apiToken) {
      return;
    }
    impogenerateplaylist(apiToken);
  }, [apiToken]);

  return (
    <>
      <h1>make a playlist from text</h1>
    </>
  );
}

export default PlaylistImporter;
