import { useEffect } from 'react';
import { Loading } from '../../../components';
import {
  JobsContainer,
  SearchContainer,
} from '../../../components/arbetsformedlingen';
import { useAppContext } from '../../../context/appContext';

const AllJobsArbetsformedlingen = () => {
  const {
    jobsArbetsformedlingen,
    getJobsArbetsformedlingen,
    isLoading,
    pageArbetsformedlingen,
  } = useAppContext();

  useEffect(() => {
    getJobsArbetsformedlingen();
  }, [pageArbetsformedlingen]);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <h1>Jobs from Af</h1>

      <SearchContainer />
      <JobsContainer />
    </>
  );
};

export default AllJobsArbetsformedlingen;
