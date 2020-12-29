import React from "react";

function Row({ artist, title }) {
  return (
    <tr>
      <td>{artist}</td>
      <td>{title}</td>
    </tr>
  );
}

function ArtistTable({ groups }) {
  const rows = Object.entries(groups).map((item, index) => {
    const firstTrack = item[1][0];
    let firstArtist = firstTrack?.track?.artists[0].name;
    return (
      <Row
        key={index}
        artist={firstArtist}
        // title={firstTrack?.track?.album?.name}
      />
    );
  });
  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}

export default ArtistTable;
