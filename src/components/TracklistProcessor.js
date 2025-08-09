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
  generateMarkdownTracklist 
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

function TrackResult({ result, index }) {
  const classes = useStyles();
  
  return (
    <Card className={`${classes.trackResult} ${result.found ? classes.foundTrack : classes.notFoundTrack}`}>
      <CardContent>
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
            <TrackResult key={index} result={result} index={index} />
          ))}
        </Box>
      )}

      <CoverArtGrid coverArtData={coverArtData} />
      
      <MarkdownOutput markdown={markdown} />
    </div>
  );
}

export default TracklistProcessor;
