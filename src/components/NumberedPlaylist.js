import React from "react";

function SongRow({ artist, title }) {
  return (
    <li>
      <span><b>{artist}</b></span> – 
      <span><i>{title}</i></span>
    </li>
  );
}

function SongList({ songs }) {
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

  // const style = {
  //   // This is unnecessary, makes the text huge when pasting into Gmail
  //   // fontSize: '200%',
  //   backgroundColor: 'white',

  //   // Add lots of padding so can get a square screenshot.
  //   padding: '10em',
  // };

  return (
    <ol className="SongList">
      {rows}
    </ol>
  );
}

export default SongList;
