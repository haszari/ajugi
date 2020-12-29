import store from "../store/store.js";
import { clearStaleApiToken } from "../store/spotify-client";

const baseUrl = "https://api.spotify.com/v1/";

async function spotifyFetch({ spotifyAccessToken, url }) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
  });

  if (response.ok) {
    return response.json();
  }

  window.localStorage.setItem("apiToken", "");
  store.dispatch(clearStaleApiToken());
  return [];
}

function playlistUrl({ playlistId, offset = 0, limit = 100 }) {
  const playlistUrl = new URL(`${baseUrl}playlists/${playlistId}/tracks`);
  playlistUrl.searchParams.append("offset", offset);
  playlistUrl.searchParams.append("limit", limit);
  return playlistUrl.href;
}

export { baseUrl, spotifyFetch, playlistUrl };