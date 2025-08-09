import { baseUrl, spotifyFetch } from "./spotify-api";

/**
 * Parse a pasted tracklist text into individual track strings
 * Handles various formats like numbered lists, artist - title, etc.
 */
export function parseTracklistText(text) {
  if (!text || !text.trim()) {
    return [];
  }

  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Remove common prefixes like "1. ", "01 ", etc.
      return line.replace(/^\d+\.?\s*/, '').trim();
    })
    .filter(line => line.length > 0);
}

/**
 * Search Spotify for a track and return detailed results
 */
export async function searchForTrack(spotifyAccessToken, trackText) {
  const url = new URL(baseUrl + "search");
  url.searchParams.append("type", "track");
  url.searchParams.append("q", trackText);
  url.searchParams.append("limit", "5"); // Get multiple results for user to choose from

  try {
    const response = await spotifyFetch({ spotifyAccessToken, url });
    const tracks = response?.tracks?.items || [];
    
    return {
      originalText: trackText,
      tracks: tracks,
      bestMatch: tracks[0] || null,
      found: tracks.length > 0
    };
  } catch (error) {
    console.error(`Error searching for track: ${trackText}`, error);
    return {
      originalText: trackText,
      tracks: [],
      bestMatch: null,
      found: false,
      error: error.message
    };
  }
}

/**
 * Process an entire tracklist by searching for each track
 */
export async function processTracklist(spotifyAccessToken, tracklistText) {
  const trackStrings = parseTracklistText(tracklistText);
  const results = [];

  for (const trackText of trackStrings) {
    const searchResult = await searchForTrack(spotifyAccessToken, trackText);
    results.push(searchResult);
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Generate cover art data from processed tracks
 */
export function generateCoverArtData(processedTracks) {
  return processedTracks
    .filter(result => result.bestMatch)
    .map(result => {
      const track = result.bestMatch;
      const album = track.album;
      
      return {
        albumId: album.id,
        albumName: album.name,
        artistName: track.artists.map(a => a.name).join(', '),
        coverImageUrl: album.images[0]?.url,
        trackName: track.name,
        originalText: result.originalText
      };
    });
}

/**
 * Generate markdown tracklist from processed tracks
 */
export function generateMarkdownTracklist(processedTracks) {
  let markdown = '';
  
  processedTracks.forEach((result, index) => {
    const trackNumber = index + 1;
    
    if (result.bestMatch) {
      const track = result.bestMatch;
      const artists = track.artists.map(a => a.name).join(' + ');
      markdown += `${trackNumber}. **${artists}** – _${track.name}_\n`;
    } else {
      // Track not found - include original text
      markdown += `${trackNumber}. **${result.originalText}** – _[NOT FOUND]_\n`;
    }
  });
  
  return markdown;
}
