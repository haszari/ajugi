import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { getApiToken } from "../store/app/selectors";
import { 
  processTracklist, 
  generateCoverArtData, 
  generateMarkdownTracklist,
  searchForTrackWithFields,
  getTrackById
} from "../lib/tracklistProcessor";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  textArea: {
    marginBottom: theme.spacing(2),
  },
  processButton: {
    marginBottom: theme.spacing(3),
  },
  coverGrid: {
    marginBottom: theme.spacing(3),
  },
  coverImage: {
    width: '100%',
    height: 'auto',
    borderRadius: theme.spacing(1),
  },
  trackResult: {
    marginBottom: theme.spacing(1),
  },
  foundTrack: {
    backgroundColor: theme.palette.success.light,
  },
  notFoundTrack: {
    backgroundColor: theme.palette.error.light,
  },
  markdownOutput: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    marginTop: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function TrackResult({ result, index, onUpdateResult, apiToken }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [artistField, setArtistField] = useState('');
  const [titleField, setTitleField] = useState('');
  const [spotifyIdField, setSpotifyIdField] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Initialize fields when entering edit mode
  const handleStartEdit = () => {
    // Try to parse the original text into artist and title
    const text = result.originalText;
    const dashIndex = text.indexOf(' - ');
    if (dashIndex > 0) {
      setArtistField(text.substring(0, dashIndex).trim());
      setTitleField(text.substring(dashIndex + 3).trim());
    } else {
      // If no dash, put everything in the title field
      setArtistField('');
      setTitleField(text.trim());
    }
    setSpotifyIdField('');
    setSearchResults([]);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSearchResults([]);
  };

  const handleSearchWithFields = async () => {
    if (!artistField.trim() && !titleField.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResult = await searchForTrackWithFields(apiToken, artistField, titleField);
      setSearchResults(searchResult.tracks || []);
    } catch (error) {
      console.error('Error searching with fields:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchById = async () => {
    if (!spotifyIdField.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResult = await getTrackById(apiToken, spotifyIdField);
      if (searchResult.found) {
        setSearchResults([searchResult.bestMatch]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching by ID:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrack = (track) => {
    // Update the result with the new track
    const updatedResult = {
      ...result,
      bestMatch: track,
      found: true,
      tracks: [track, ...result.tracks]
    };
    onUpdateResult(index, updatedResult);
    setIsEditing(false);
  };
  
  return (
    <Card className={`${classes.trackResult} ${result.found ? classes.foundTrack : classes.notFoundTrack}`}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <div style={{ flex: 1 }}>
            <Typography variant="body2">
              <strong>{index + 1}.</strong> {result.originalText}
            </Typography>
            {result.found ? (
              <Typography variant="body2" color="textSecondary">
                ✓ Found: {result.bestMatch.artists.map(a => a.name).join(', ')} - {result.bestMatch.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                ✗ Not found
              </Typography>
            )}
          </div>
          
          {!isEditing && (
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleStartEdit}
              style={{ marginLeft: 16 }}
            >
              Refine Search
            </Button>
          )}
        </Box>

        {isEditing && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              <strong>Refine Search:</strong>
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Artist"
                  size="small"
                  fullWidth
                  value={artistField}
                  onChange={(e) => setArtistField(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Title"
                  size="small"
                  fullWidth
                  value={titleField}
                  onChange={(e) => setTitleField(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSearchWithFields}
                  disabled={isSearching || (!artistField.trim() && !titleField.trim())}
                  fullWidth
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Spotify ID or URL"
                    size="small"
                    fullWidth
                    value={spotifyIdField}
                    onChange={(e) => setSpotifyIdField(e.target.value)}
                    variant="outlined"
                    placeholder="spotify:track:... or https://open.spotify.com/track/..."
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearchById}
                    disabled={isSearching || !spotifyIdField.trim()}
                    fullWidth
                  >
                    Get by ID
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {searchResults.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  <strong>Select the correct track:</strong>
                </Typography>
                {searchResults.slice(0, 5).map((track, trackIndex) => (
                  <Box 
                    key={trackIndex} 
                    p={1} 
                    mb={1} 
                    border={1} 
                    borderColor="grey.300" 
                    borderRadius={1}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectTrack(track)}
                  >
                    <Typography variant="body2">
                      <strong>{track.artists.map(a => a.name).join(', ')}</strong> - {track.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Album: {track.album.name} ({track.album.release_date?.substring(0, 4)})
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Box mt={2} display="flex" gap={1}>
              <Button size="small" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function CoverArtGrid({ coverArtData }) {
  const classes = useStyles();
  
  if (coverArtData.length === 0) {
    return null;
  }

  return (
    <div className={classes.coverGrid}>
      <Typography variant="h5" gutterBottom>
        Cover Art Grid
      </Typography>
      <Grid container spacing={2}>
        {coverArtData.map((cover, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <img 
              src={cover.coverImageUrl} 
              alt={`${cover.artistName} - ${cover.albumName}`}
              className={classes.coverImage}
              title={`${cover.artistName} - ${cover.albumName}`}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function MarkdownOutput({ markdown }) {
  const classes = useStyles();
  
  if (!markdown) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h5">
          Tracklist Markdown
        </Typography>
        <Button variant="outlined" size="small" onClick={handleCopy}>
          Copy to Clipboard
        </Button>
      </Box>
      <Paper className={classes.markdownOutput}>
        {markdown}
      </Paper>
    </div>
  );
}

function TracklistProcessor() {
  const classes = useStyles();
  const apiToken = useSelector(getApiToken);
  
  const [tracklistText, setTracklistText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [coverArtData, setCoverArtData] = useState([]);
  const [markdown, setMarkdown] = useState('');

  const handleUpdateResult = (index, updatedResult) => {
    const newResults = [...results];
    newResults[index] = updatedResult;
    setResults(newResults);
    
    // Regenerate outputs with updated results
    const coverData = generateCoverArtData(newResults);
    setCoverArtData(coverData);
    
    const markdownOutput = generateMarkdownTracklist(newResults);
    setMarkdown(markdownOutput);
  };

  const handleProcess = async () => {
    if (!tracklistText.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      const processedResults = await processTracklist(apiToken, tracklistText);
      setResults(processedResults);
      
      const coverData = generateCoverArtData(processedResults);
      setCoverArtData(coverData);
      
      const markdownOutput = generateMarkdownTracklist(processedResults);
      setMarkdown(markdownOutput);
      
    } catch (error) {
      console.error('Error processing tracklist:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const foundCount = results.filter(r => r.found).length;
  const totalCount = results.length;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <Typography variant="h4" gutterBottom>
            Tracklist to Cover Art & Markdown
          </Typography>
          <Chip 
            label="✓ Connected to Spotify" 
            color="primary" 
            size="small"
          />
        </div>
      </div>
      
      <Typography variant="body1" gutterBottom color="textSecondary">
        Paste your tracklist below and we'll search Spotify to generate a cover art grid and formatted markdown.
      </Typography>

      <TextField
        className={classes.textArea}
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        placeholder="Paste your tracklist here... (e.g. 'Artist - Track Name' or numbered list)"
        value={tracklistText}
        onChange={(e) => setTracklistText(e.target.value)}
        disabled={isProcessing}
      />

      <Button
        className={classes.processButton}
        variant="contained"
        color="primary"
        size="large"
        onClick={handleProcess}
        disabled={isProcessing || !tracklistText.trim()}
      >
        {isProcessing ? 'Processing...' : 'Process Tracklist'}
      </Button>

      {isProcessing && (
        <Box mb={3}>
          <LinearProgress />
          <Typography variant="body2" align="center" style={{ marginTop: 8 }}>
            Searching Spotify for tracks...
          </Typography>
        </Box>
      )}

      {results.length > 0 && !isProcessing && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <Box mb={2}>
            <Chip 
              label={`${foundCount}/${totalCount} tracks found`} 
              color={foundCount === totalCount ? "primary" : "default"}
            />
          </Box>
          {results.map((result, index) => (
            <TrackResult 
              key={index} 
              result={result} 
              index={index} 
              onUpdateResult={handleUpdateResult}
              apiToken={apiToken}
            />
          ))}
        </Box>
      )}

      <CoverArtGrid coverArtData={coverArtData} />
      
      <MarkdownOutput markdown={markdown} />
    </div>
  );
}

export default TracklistProcessor;
