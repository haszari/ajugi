import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import store from "../store/store.js";

import { fetchSongs } from "../store/albums";
import {
  getStatus,
  getSongs,
} from "../store/albums/selectors";
import { getApiToken } from "../store/app/selectors";

const zeroPad = (num, places) => String(num).padStart(places, '0');

function millisecondsToDurationString(msec) {
  const secondsPerMinute = 60;
  const seconds = msec / 1000.0;
  const minutes = Math.floor( seconds / secondsPerMinute );
  const partial = zeroPad( Math.round( seconds % secondsPerMinute ), 2 ); 
  return `${minutes}:${partial}`;
}


function SongHeader() {
  return (
    <tr>
      <th className="artist">Artist</th>
      <td className="title">Title</td>
      <td className="title">Duration</td>
      <td>Popularity</td>
    </tr>
  );
}

function SongRow({ song }) {
  let artistNames = song?.track?.artists.map((current) => current.name);
  let artist = artistNames.join(" + ");
  let title = song?.track?.name;
  let popularity = song?.track?.popularity;
  let duration = millisecondsToDurationString( song?.track?.duration_ms );
  return (
    <tr>
      <td className="artist">{artist}</td>
      <td className="title">{title}</td>
      <td>{duration}</td>
      <td>{popularity}</td>
    </tr>
  );
}

function SongList({ songs }) {
  const rows = songs.map((song, index) => {
    return (
      <SongRow
        key={index}
        song={song}
      />
    );
  });
  return rows;
}

function Songs() {
  const status = useSelector(getStatus);
  const spotifyAccessToken = useSelector(getApiToken);
  const songs = useSelector(getSongs);

  // Start loading songs on mount.
  useEffect(() => {
    store.dispatch(fetchSongs({ spotifyAccessToken }));
  }, [spotifyAccessToken]);

  if (status === "loading") {
    return "Loading songs…";
  }

  return (
    <table className="Songs-container">
      <thead>
        <SongHeader />
      </thead>
      <tbody>
        <SongList songs={songs} />
      </tbody>
    </table>
  );
}

export default Songs;
