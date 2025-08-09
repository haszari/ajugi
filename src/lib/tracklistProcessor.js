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
 * Search Spotify with specific artist and title fields
 */
export async function searchForTrackWithFields(spotifyAccessToken, artist, title) {
  const url = new URL(baseUrl + "search");
  url.searchParams.append("type", "track");
  
  // Use Spotify's field search syntax for more precise results
  let query = '';
  if (artist && artist.trim()) {
    query += `artist:${artist.trim()} `;
  }
  if (title && title.trim()) {
    query += `track:${title.trim()}`;
  }
  
  url.searchParams.append("q", query.trim());
  url.searchParams.append("limit", "10");

  try {
    const response = await spotifyFetch({ spotifyAccessToken, url });
    const tracks = response?.tracks?.items || [];
    
    return {
      originalText: `${artist} - ${title}`,
      tracks: tracks,
      bestMatch: tracks[0] || null,
      found: tracks.length > 0,
      searchQuery: query.trim()
    };
  } catch (error) {
    console.error(`Error searching for track with fields: ${artist} - ${title}`, error);
    return {
      originalText: `${artist} - ${title}`,
      tracks: [],
      bestMatch: null,
      found: false,
      error: error.message,
      searchQuery: query.trim()
    };
  }
}

/**
 * Get track by Spotify ID
 */
export async function getTrackById(spotifyAccessToken, trackId) {
  // Clean the track ID (remove spotify:track: prefix if present)
  const cleanId = trackId.replace(/^spotify:track:/, '').replace(/^https:\/\/open\.spotify\.com\/track\//, '').split('?')[0];
  
  const url = new URL(baseUrl + `tracks/${cleanId}`);

  try {
    const track = await spotifyFetch({ spotifyAccessToken, url });
    
    return {
      originalText: `Spotify ID: ${trackId}`,
      tracks: [track],
      bestMatch: track,
      found: true,
      fromSpotifyId: true
    };
  } catch (error) {
    console.error(`Error getting track by ID: ${trackId}`, error);
    return {
      originalText: `Spotify ID: ${trackId}`,
      tracks: [],
      bestMatch: null,
      found: false,
      error: error.message,
      fromSpotifyId: true
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
    .filter(result => result.bestMatch || result.customTrack)
    .map(result => {
      // Handle custom tracks
      if (result.customTrack) {
        return {
          albumId: `custom-${Date.now()}-${Math.random()}`,
          albumName: result.customTrack.albumName || 'Custom Track',
          artistName: result.customTrack.artistName || 'Unknown Artist',
          coverImageUrl: result.customTrack.coverImageUrl,
          trackName: result.customTrack.trackName || 'Unknown Track',
          originalText: result.originalText,
          isCustom: true
        };
      }
      
      // Handle Spotify tracks
      const track = result.bestMatch;
      const album = track.album;
      
      return {
        albumId: album.id,
        albumName: album.name,
        artistName: track.artists.map(a => a.name).join(', '),
        coverImageUrl: album.images[0]?.url,
        trackName: track.name,
        originalText: result.originalText,
        isCustom: false
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
    
    if (result.customTrack) {
      // Custom track
      const custom = result.customTrack;
      markdown += `${trackNumber}. **${custom.artistName || 'Unknown Artist'}** – _${custom.trackName || 'Unknown Track'}_\n`;
    } else if (result.bestMatch) {
      // Spotify track
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
