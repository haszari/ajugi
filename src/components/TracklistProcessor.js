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
    backgroundColor: '#f0f0f0', // Light grey for all track cards
  },
  notFoundTrack: {
    backgroundColor: '#f0f0f0', // Light grey for all track cards
  },
  hiddenTrack: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0', // Same light grey but with reduced opacity
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
  trackTextContainer: {
    position: 'relative',
    flex: 1,
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: '#f8f8f8',
      border: '1px solid #e0e0e0',
    }
  },
  editIcon: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    fontSize: '14px',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  playlistCanvas: {
    marginBottom: theme.spacing(3),
  },
  canvasContainer: {
    width: '1111px',
    height: '1111px',
    border: '2px solid #ddd',
    borderRadius: theme.spacing(1),
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    margin: '0 auto',
    maxWidth: '100%', // Responsive fallback
  },
  canvasTracklistSection: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  tracklistContent: {
    width: '100%',
    textAlign: 'left',
  },
  tracklistLine: {
    marginBottom: theme.spacing(1),
    fontSize: '1rem',
    lineHeight: 1.5,
  },
}));

function TrackResult({ result, index, onUpdateResult, apiToken }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(result.isNewTrack || false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [artistField, setArtistField] = useState('');
  const [titleField, setTitleField] = useState('');
  const [spotifyIdField, setSpotifyIdField] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Custom track fields
  const [customArtist, setCustomArtist] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customAlbum, setCustomAlbum] = useState('');
  const [customCoverImage, setCustomCoverImage] = useState(null);
  const [customCoverImageUrl, setCustomCoverImageUrl] = useState('');
  
  // Markdown editing state
  const [isEditingMarkdown, setIsEditingMarkdown] = useState(false);
  const [markdownText, setMarkdownText] = useState('');

  // Initialize markdown text when result changes
  React.useEffect(() => {
    // Don't update if user is actively editing
    if (isEditingMarkdown) {
      return;
    }
    
    const getDefaultMarkdownText = () => {
      if (result.customTrack) {
        const custom = result.customTrack;
        return `**${custom.artistName || 'Unknown Artist'}** – _${custom.trackName || 'Unknown Track'}_`;
      } else if (result.bestMatch) {
        const track = result.bestMatch;
        const artists = track.artists.map(a => a.name).join(' + ');
        return `**${artists}** – _${track.name}_`;
      } else if (result.isNewTrack) {
        return '**Artist** – _Track title_';
      } else {
        return `**${result.originalText}** – _[NOT FOUND]_`;
      }
    };

    setMarkdownText(result.customMarkdown || getDefaultMarkdownText());
  }, [result.customMarkdown, result.customTrack, result.bestMatch, result.originalText, result.isNewTrack, isEditingMarkdown]);

  const handleStartMarkdownEdit = () => {
    const defaultMarkdown = (() => {
      if (result.customTrack) {
        const custom = result.customTrack;
        return `**${custom.artistName || 'Unknown Artist'}** – _${custom.trackName || 'Unknown Track'}_`;
      } else if (result.bestMatch) {
        const track = result.bestMatch;
        const artists = track.artists.map(a => a.name).join(' + ');
        return `**${artists}** – _${track.name}_`;
      } else if (result.isNewTrack) {
        return '**Artist** – _Track Title_';
      } else {
        return `**${result.originalText}** – _[NOT FOUND]_`;
      }
    })();
    
    setMarkdownText(result.customMarkdown || defaultMarkdown);
    setIsEditingMarkdown(true);
  };

  const handleSaveMarkdown = () => {
    const updatedResult = {
      ...result,
      customMarkdown: markdownText
    };
    onUpdateResult(index, updatedResult);
    setIsEditingMarkdown(false);
  };

  // Function to render markdown as rich text
  const renderMarkdownAsRich = (markdownStr) => {
    if (!markdownStr) return null;
    
    // Simple markdown parsing for bold (**text**) and italic (_text_)
    const parts = markdownStr.split(/(\*\*.*?\*\*|_.*?_)/);
    
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={idx}>{part.slice(1, -1)}</em>;
      } else {
        return part;
      }
    });
  };

  // Get the current markdown text to display
  const getCurrentMarkdownText = () => {
    let markdownText = '';
    
    if (result.customMarkdown) {
      markdownText = result.customMarkdown;
    } else {
      // Generate default markdown
      if (result.customTrack) {
        const custom = result.customTrack;
        markdownText = `**${custom.artistName || 'Unknown Artist'}** – _${custom.trackName || 'Unknown Track'}_`;
      } else if (result.bestMatch) {
        const track = result.bestMatch;
        const artists = track.artists.map(a => a.name).join(' + ');
        markdownText = `**${artists}** – _${track.name}_`;
      } else if (result.isNewTrack) {
        markdownText = '**Artist** – _Track title_';
      } else {
        markdownText = `**${result.originalText}** – _[NOT FOUND]_`;
      }
    }
    
    // Append [NZ] if track is marked as NZ produced
    if (result.isNZ) {
      markdownText += ' [NZ]';
    }
    
    return markdownText;
  };
  
  // Initialize fields when entering edit mode
  const handleStartEdit = () => {
    // Try to parse the original text into artist and title
    const text = result.originalText;
    const dashIndex = text.indexOf(' - ');
    if (dashIndex > 0) {
      setArtistField(text.substring(0, dashIndex).trim());
      setTitleField(text.substring(dashIndex + 3).trim());
      setCustomArtist(text.substring(0, dashIndex).trim());
      setCustomTitle(text.substring(dashIndex + 3).trim());
    } else {
      // If no dash, put everything in the title field
      setArtistField('');
      setTitleField(text.trim());
      setCustomArtist('');
      setCustomTitle(text.trim());
    }
    setSpotifyIdField('');
    setSearchResults([]);
    setCustomAlbum('');
    setCustomCoverImage(null);
    setCustomCoverImageUrl('');
    setIsCustomMode(false);
    setIsEditing(true);
  };

  const handleStartCustom = () => {
    // Initialize custom fields from original text
    const text = result.originalText;
    const dashIndex = text.indexOf(' - ');
    if (dashIndex > 0) {
      setCustomArtist(text.substring(0, dashIndex).trim());
      setCustomTitle(text.substring(dashIndex + 3).trim());
    } else {
      setCustomArtist('');
      setCustomTitle(text.trim());
    }
    setCustomAlbum('');
    setCustomCoverImage(null);
    setCustomCoverImageUrl('');
    setIsCustomMode(true);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCustomMode(false);
    setSearchResults([]);
    setCustomCoverImageUrl('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCustomCoverImage(file);
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCustomCoverImageUrl(imageUrl);
    }
  };

  const handleToggleVisibility = () => {
    const updatedResult = {
      ...result,
      hidden: !result.hidden
    };
    onUpdateResult(index, updatedResult);
  };

  const handleToggleNZ = () => {
    const updatedResult = {
      ...result,
      isNZ: !result.isNZ
    };
    onUpdateResult(index, updatedResult);
  };

  const handleSaveCustom = () => {
    if (!customArtist.trim() || !customTitle.trim()) {
      alert('Please provide both artist and title for the custom track.');
      return;
    }

    // Create custom track result
    const customTrack = {
      artistName: customArtist.trim(),
      trackName: customTitle.trim(),
      albumName: customAlbum.trim() || 'Single',
      coverImageUrl: customCoverImageUrl,
      coverImageFile: customCoverImage
    };

    const updatedResult = {
      ...result,
      customTrack: customTrack,
      found: true,
      bestMatch: null, // Clear Spotify match since we're using custom
      customMarkdown: null // Clear custom markdown so it regenerates from new track data
    };

    onUpdateResult(index, updatedResult);
    setIsEditing(false);
    setIsCustomMode(false);
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
      tracks: [track, ...result.tracks],
      customMarkdown: null // Clear custom markdown so it regenerates from new track data
    };
    onUpdateResult(index, updatedResult);
    setIsEditing(false);
  };
  
  return (
    <Card className={`${classes.trackResult} ${
      result.hidden ? classes.hiddenTrack : 
      result.found ? classes.foundTrack : 
      classes.notFoundTrack
    }`}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          {!isEditing ? (
            <>
              <div style={{ flex: 1 }}>
                {isEditingMarkdown ? (
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={markdownText}
                      onChange={(e) => setMarkdownText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveMarkdown();
                        }
                      }}
                      label="Markdown format"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <Button
                            size="small"
                            onClick={handleSaveMarkdown}
                            style={{ 
                              minWidth: 'auto', 
                              padding: '4px',
                              margin: 0,
                              border: 'none',
                              backgroundColor: 'transparent'
                            }}
                          >
                            ✓
                          </Button>
                        )
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    className={classes.trackTextContainer}
                    onClick={!isEditing ? handleStartMarkdownEdit : undefined}
                    style={{
                      cursor: !isEditing ? 'pointer' : 'default',
                      opacity: isEditing ? 0.7 : 1
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      style={{ 
                        opacity: result.hidden ? 0.6 : 1,
                        paddingRight: '20px' // Space for edit icon
                      }}
                      title="Click to edit markdown format"
                    >
                      <strong>{index + 1}.</strong> {renderMarkdownAsRich(getCurrentMarkdownText())}
                      {result.hidden && <span style={{ marginLeft: 8, fontStyle: 'italic', color: '#666' }}>[Hidden]</span>}
                    </Typography>
                    <span className={classes.editIcon}>✏️</span>
                  </Box>
                )}
                {result.customTrack ? (
                  <Typography variant="body2" color="primary">
                    ✓ Custom: {result.customTrack.artistName} - {result.customTrack.trackName}
                  </Typography>
                ) : result.found ? (
                  <Typography variant="body2" color="textSecondary">
                    ✓ Spotify: {result.bestMatch.artists.map(a => a.name).join(', ')} - {result.bestMatch.name}
                  </Typography>
                ) : result.isNewTrack ? (
                  <Typography variant="body2" color="textSecondary">
                    Click "Custom" or "Refine search" to add track details
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error">
                    ✗ Not found
                  </Typography>
                )}
              </div>
              
              {!isEditingMarkdown && (
                <Box display="flex" gap={3} alignItems="flex-start" style={{ marginLeft: 16 }}>
                  {/* Search Actions Column */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Button 
                      size="small" 
                      variant="text"
                      onClick={handleStartEdit}
                      style={{ 
                        minWidth: 120,
                        '&:hover': {
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      Refine search
                    </Button>
                    <Button 
                      size="small" 
                      variant="text"
                      color="secondary"
                      onClick={handleStartCustom}
                      style={{ 
                        minWidth: 120,
                        '&:hover': {
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      Custom
                    </Button>
                  </Box>
                  
                  {/* Visibility Toggle Column */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Button
                      size="small"
                      variant="text"
                      color={result.hidden ? "default" : "primary"}
                      onClick={handleToggleVisibility}
                      style={{ 
                        minWidth: 80,
                        '&:hover': {
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      {result.hidden ? 'Show' : 'Hide'}
                    </Button>
                    <Button
                      size="small"
                      variant={result.isNZ ? "contained" : "text"}
                      color="primary"
                      onClick={handleToggleNZ}
                      style={{ 
                        minWidth: 80,
                        backgroundColor: result.isNZ ? '#1976d2' : 'transparent',
                        color: result.isNZ ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: result.isNZ ? '#1565c0' : '#e0e0e0'
                        }
                      }}
                    >
                      NZ
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          ) : null}
        </Box>

        {isEditing && (
          <Box mt={2}>
            {isCustomMode ? (
              // Custom track mode
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>Custom track:</strong>
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Artist"
                      size="small"
                      fullWidth
                      value={customArtist}
                      onChange={(e) => setCustomArtist(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Track title"
                      size="small"
                      fullWidth
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Album (optional)"
                      size="small"
                      fullWidth
                      value={customAlbum}
                      onChange={(e) => setCustomAlbum(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`cover-upload-${index}`}
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor={`cover-upload-${index}`}>
                      <Button variant="outlined" component="span" size="small" fullWidth>
                        Upload cover art
                      </Button>
                    </label>
                  </Grid>
                </Grid>

                {customCoverImageUrl && (
                  <Box mt={2}>
                    <Typography variant="body2" gutterBottom>Cover preview:</Typography>
                    <img 
                      src={customCoverImageUrl} 
                      alt="Cover preview" 
                      style={{ maxWidth: 100, maxHeight: 100, borderRadius: 4 }}
                    />
                  </Box>
                )}

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button size="small" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={handleSaveCustom}
                    disabled={!customArtist.trim() || !customTitle.trim()}
                  >
                    Save custom track
                  </Button>
                </Box>
              </>
            ) : (
              // Spotify search mode
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>Refine search:</strong>
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
              </>
            )}
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
        Cover art grid
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

function PlaylistCanvas({ coverArtData, markdown }) {
  const classes = useStyles();
  const [fontSize, setFontSize] = React.useState(16); // Default font size in px
  const [leftMargin, setLeftMargin] = React.useState(0); // Default left margin in em
  
  if (!markdown) {
    return null;
  }

  // Parse markdown into structured list
  const tracklistLines = markdown.split('\n').filter(line => line.trim());

  const adjustLeftMargin = (delta) => {
    setLeftMargin(prev => Math.max(0, Math.min(10, prev + delta))); // Clamp between 0 and 10em
  };

  return (
    <div className={classes.playlistCanvas}>
      {/* Controls */}
      <Box display="flex" alignItems="center" gap={4} mb={2}>
        {/* Font Size Control */}
        <Box display="flex" alignItems="center" gap={1} minWidth={150}>
          <Typography variant="body2" style={{ minWidth: 'fit-content' }}>
            Font size:
          </Typography>
          <input
            type="range"
            min="12"
            max="36"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <Typography variant="body2" style={{ minWidth: '30px' }}>
            {fontSize}px
          </Typography>
        </Box>
        
        {/* Left Margin Control */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" style={{ minWidth: 'fit-content' }}>
            Left margin:
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => adjustLeftMargin(-0.5)}
            style={{ minWidth: '30px', padding: '4px' }}
          >
            ←
          </Button>
          <Typography variant="body2" style={{ minWidth: '50px', textAlign: 'center' }}>
            {leftMargin}em
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => adjustLeftMargin(0.5)}
            style={{ minWidth: '30px', padding: '4px' }}
          >
            →
          </Button>
        </Box>
      </Box>
      
      <div className={classes.canvasContainer}>
        {/* Tracklist Section */}
        <div className={classes.canvasTracklistSection}>
          <div 
            className={classes.tracklistContent}
            style={{ 
              marginLeft: `${leftMargin}em`,
              fontSize: `${fontSize}px`
            }}
          >
            {tracklistLines.map((line, index) => {
              // Parse markdown formatting for display
              const renderLine = (text) => {
                const parts = text.split(/(\*\*.*?\*\*|_.*?_|\[NZ\])/);
                
                return parts.map((part, idx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx}>{part.slice(2, -2)}</strong>;
                  } else if (part.startsWith('_') && part.endsWith('_')) {
                    return <em key={idx}>{part.slice(1, -1)}</em>;
                  } else if (part === '[NZ]') {
                    return <span key={idx} style={{ color: '#1976d2', fontWeight: 'bold' }}>{part}</span>;
                  } else {
                    return part;
                  }
                });
              };
              
              return (
                <Typography 
                  key={index} 
                  variant="body1" 
                  className={classes.tracklistLine}
                  style={{ fontSize: 'inherit' }} // Inherit from parent
                >
                  {renderLine(line)}
                </Typography>
              );
            })}
          </div>
        </div>
      </div>
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
          Tracklist markdown
        </Typography>
        <Button variant="outlined" size="small" onClick={handleCopy}>
          Copy to clipboard
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

  const handleAddTrack = () => {
    // Add a new empty track result
    const newTrack = {
      originalText: `New Track ${results.length + 1}`,
      tracks: [],
      bestMatch: null,
      found: false,
      isNewTrack: true
    };
    
    const newResults = [...results, newTrack];
    setResults(newResults);
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
            Tracklist to cover art & markdown
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
        {isProcessing ? 'Processing...' : 'Process tracklist'}
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
            Search results
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
          
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddTrack}
              startIcon={<span>+</span>}
            >
              Add track
            </Button>
          </Box>
        </Box>
      )}

      <CoverArtGrid coverArtData={coverArtData} />
      
      <PlaylistCanvas coverArtData={coverArtData} markdown={markdown} />
      
      <MarkdownOutput markdown={markdown} />
    </div>
  );
}

export default TracklistProcessor;
