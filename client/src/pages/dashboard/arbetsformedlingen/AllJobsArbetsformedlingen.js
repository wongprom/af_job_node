import { useEffect } from 'react';
import { JobsContainer, Loading, SearchContainer } from '../../../components';
import { useAppContext } from '../../../context/appContext';

const AllJobsArbetsformedlingen = () => {
  const { jobsArbetsformedlingen, getJobsArbetsformedlingen, isLoading } =
    useAppContext();

  useEffect(() => {
    getJobsArbetsformedlingen();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <h1>AllJobsArbetsformedlingen Page</h1>
      {jobsArbetsformedlingen?.map((job) => (
        <p key={job._id}>{job.company}</p>
      ))}

      {/* <SearchContainer />
      <JobsContainer /> */}
    </>
  );
};

export default AllJobsArbetsformedlingen;
