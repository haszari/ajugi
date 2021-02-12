import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { getApiToken } from "../store/app/selectors";

import { baseUrl, spotifyFetch } from "../lib/spotify-api";

const rawPlaylistItems = [
  "Your Love - Frankie Knuckles",
  "City Lights - William Pitt",
  "Together In Electric Dreams - Philip Oakey, Giorgio Moroder",
  "Dream Girl - Pierre's Pfantasy Club",
  "Rich In Paradise - FPI Project",
  "It's You - ESP",
  "String Free - Phortune",
  "Don’t You Want Me - Felix",
  "Blue Monday - New Order",
  "Sweet Harmony - Liquid",
  "The Sun Rising - The Beloved",
  "Get Real - Paul Rutherford",
  "Bring on the Night - Eric Caver, Paul Timmerman",
  "Voodoo Ray - A Guy Called Gerald",
  "Cariño - T-Coy",
  "Hallelujah - Happy Mondays",
  "King Of The Beats - Mantronix",
  "Bizarre Love Triangle - New Order",
  "Strings Of Life - Rhythim is Rhythim",
  "Housemaster - Terry Baldwin",
  "Pump Up The Volume - M/A/R/R/S",
  "I've Lost Control - Sleezy D",
  "Humanoid - Stakker Humanoid",
  "Can You Feel It - Mr Fingers",
  "The Story Of The Blues - Wah",
  "Beat Dis - Bomb the Bass",
  "Give It To Me - Bam Bam",
  "Can You Feel It - Mr Fingers",
  "Let The Music (Use You) - The Night Writers",
  "Siesta - Alec Williams",
  "The Sound - Reese And Santonio",
  "Acid Trax - Phuture",
  "Barbados - Typically Tropical",
  "Moments in Love - Art of Noise",
  "Dance Away - Roxy Music",
  "White Lines - Grand Master Flash",
  "In the Name of Love - U2",
  "Land of Confusion - Armando",
  "Pump up the Jam - Technotronic",
  "Run For Your Life - Luke Richards",
  "New Day Sun - Tom Quick",
  "Acid Trip - John 00 Fleming",
  "Theme From S'Express - S'Express",
  "Someday - Ce Ce Rogers",
  "Save A Prayer - Duran Duran",
  "Big Fun - Inner City",
  "Acid Trax - Phuture",
  "We Call It Acieeed - D Mob",
  "The Morning After - Fallout",
  "No Way Back - Adonis",
  "Cübik - 808 State",
  "Can You Party - Royal House",
  "Smack - Daniel Gautreau",
  "I’ll House You - Jungle Bros",
  "Also Sprach Zarathustra - London Symphony Orchestra",
  "Infinity - Guru Josh",
  "Acid Thunder - Fast Eddie",
  "Pacific State - 808 State",
  "Salsa House - Richie Rich",
  "Lack of Love - Charles B., Adonis",
  "French Kiss - Lil' Louis",
  "Chime - Orbital",
  "People Hold On - Coldcut, Lisa Stansfield",
  "Work It To The Bone - LNR",
  "Go - Moby",
  "Sometimes - Erasure",
  "Ride on Time - Blackbox",
  "The Phantom - Renegade Soundwave",
  "Risky - FPI Project",
  "Flesh - A Split Second",
  "Charly - The Prodigy",
  "Hardcore Uproar - Together",
  "LFO - LFO",
  "Go - Moby",
  "Boneyween - 808 State",
  "Papua New Guinea - The Future Sound of London",
  "Mentok 1 - LFO",
  "It's All Right - Sterling Void",
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
      name: "BBC Acid " + Math.random(),
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
