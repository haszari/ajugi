import store from "../store/store.js";
import { clearStaleApiToken } from "../store/app";

const baseUrl = "https://api.spotify.com/v1/";

async function spotifyFetch({
  spotifyAccessToken,
  url,
  method = "GET",
  body = null,
}) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    return response.json();
  }

  window.localStorage.setItem("apiToken", "");
  store.dispatch(clearStaleApiToken());
  return [];
}

function playItem({ spotifyAccessToken, uri }) {
  const playStartUrl = new URL(`${baseUrl}me/player/play`);
  fetch(playStartUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
    body: JSON.stringify({
      context_uri: uri,
    }),
  });
}

function playlistUrl({ playlistId, offset = 0, limit = 100 }) {
  const playlistUrl = new URL(`${baseUrl}playlists/${playlistId}/tracks`);
  playlistUrl.searchParams.append("offset", offset);
  playlistUrl.searchParams.append("limit", limit);
  return playlistUrl.href;
}

export { baseUrl, spotifyFetch, playItem, playlistUrl };
