import { useAppContext } from '../../context/appContext';
import { useEffect } from 'react';
import Loading from '../Loading';
import { Job } from './index';
import Alert from '../Alert';
import Wrapper from '../../assets/wrappers/JobsContainer';
import { PageBtnContainer } from '../arbetsformedlingen/index';

const JobsContainer = () => {
  const {
    getJobsArbetsformedlingen,
    jobsArbetsformedlingen,
    isLoading,
    pageArbetsformedlingen,
    totalJobsArbetsformedlingen,
    // search,
    // searchStatus,
    // searchType,
    // sort,
    numOfPagesArbetsformedlingen,
    showAlert,
  } = useAppContext();

  if (isLoading) {
    return <Loading center />;
  }

  if (jobsArbetsformedlingen.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobsArbetsformedlingen} job
        {jobsArbetsformedlingen.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobsArbetsformedlingen.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPagesArbetsformedlingen > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
