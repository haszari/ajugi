import React from "react";

function SongRow({ artist, title }) {
  return (
    <tr>
      <td>{artist}</td>
      <td>{title}</td>
    </tr>
  );
}

function SongTable({ songs }) {
  const rows = songs.map((song, index) => {
    let artistNames = song?.track?.artists.map((current) => current.name);
    return (
      <SongRow
        key={index}
        artist={artistNames.join(" + ")}
        title={song?.track?.name}
      />
    );
  });
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}

export default SongTable;
