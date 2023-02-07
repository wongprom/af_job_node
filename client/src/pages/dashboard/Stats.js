import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { StatsContainer, Loading, ChartsContainer } from '../../components';

const Stats = () => {
  const {
    showStats,
    isLoading,
    monthlyApplications,
    getJobsArbetsformedlingen,
    totalJobsArbetsformedlingen,
  } = useAppContext();
  useEffect(() => {
    showStats();
    getJobsArbetsformedlingen();
  }, []);

  if (isLoading) {
    <Loading center />;
  }
  // https://jobsearch.api.jobtechdev.se/search?q=react&offset=0&limit=10
  // https://jobsearch.api.jobtechdev.se/
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};
export default Stats;
