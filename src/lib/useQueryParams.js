import { useLocation } from 'react-router-dom';

function useQuery() {
  const bam = useLocation();

  return new URLSearchParams( useLocation().search );
}

export default useQuery;
