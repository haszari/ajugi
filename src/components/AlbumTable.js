import React from "react";

function Row({ index, type, artist, title }) {
  return (
    <tr>
      <td>{index}</td>
      <td>{type}</td>
      <td>{artist}</td>
      <td>{title}</td>
    </tr>
  );
}

function AlbumTable({ groups }) {
  const rows = Object.entries(groups).map((item, index) => {
    const firstTrack = item[1][0];
    let artistNames = firstTrack?.track?.artists.map((current) => current.name);
    return (
      <Row
        key={index}
        index={index}
        type={firstTrack?.track?.album?.album_type}
        artist={artistNames.join(" + ")}
        title={firstTrack?.track?.album?.name}
      />
    );
  });
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}

export default AlbumTable;
