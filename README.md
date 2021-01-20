# Ajugi - Spotify playlist explorer

Experimenting with different ways of visualising Spotify playlists - e.g. by artist or album.

Live on [GitHub Pages](https://pages.github.com): https://landscape.cartoonbeats.com/ajugi/

<a href="https://landscape.cartoonbeats.com/ajugi/">![screenshot](doc/screenshot.png)</a>

## How to use

Currently this allows you to view a playlist as album art, and play specific albums. Kinda like browsing records in a record store and then listening to them.

1. Visit root url and authorise Spotify.
1. Click on a playlist to select it.
1. Click `Show Albums`.
1. Playlist will load - large playlists (1000+) take time.
1. View album cover art in a grid.
1. Click an album to show date, artist and title.
1. Click `Play` to play that album in Spotify.

Playback is controlled via Spotify, so you can skip, shuffle, etc as normal.

## Development

- `npm start` – run in dev mode
- `npm run build` - production minified build into `build` folder
- `npm run deploy` - production build and deploy to [GitHub Pages](https://pages.github.com)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
