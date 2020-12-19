import { useLocation } from 'react-router-dom';

function useUrlHashParams() {
  // Obtains named parameters from the hash section of the URL.
  // Borrowed from Spotify API sample code.
  var hashParams = {};
  var r = /([^&;=]+)=?([^&;]*)/g,
      q = useLocation().hash.substring(1);
  let match = r.exec(q);
  while ( match ) {
    hashParams[ match[1] ] = decodeURIComponent( match[2] );
    match = r.exec(q);
  }
  return hashParams;
}

export default useUrlHashParams;
