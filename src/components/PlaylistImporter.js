import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { getApiToken } from "../store/app/selectors";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

const rawPlaylistItems = [
  "Junes - Shifting Sands (Central mix)",
  "Scope Zone - Liquid Earth",
  "Guy Contact - Body Groove",
  "Moktar - Blue",
  "Hame DJ - Zoot",
  "Reptant - Liquid Acrobatics",
  "Eden Burns - Hands Off My Beat",
  "Eden Burns - Hand On The Chart",
  "Nice Girl - Hot mm & Hmm's",
  "Ambien Baby - El Kesh",
  "DJ JM - Rainee",
  "Juno Mamba - 1996 ft. ANTONMOND (Manami remix)",
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
