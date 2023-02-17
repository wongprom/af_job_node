import Job from '../models/Job.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import moment from 'moment';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import axios from 'axios';

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values');
  }
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};

const getAllJobsArbetsformedlingen = async (req, res) => {
  const { searchArbetsformedlingen, pageArbetsformedlingen } = req.body;
  // https://jobsearch.api.jobtechdev.se/search?q=react&offset=0&limit=10
  // info 'https://jobsearch.api.jobtechdev.se/search?q=react%20fullstack%20dev&offset=0&limit=10'
  // https://jobsearch.api.jobtechdev.se/

  const page = Number(pageArbetsformedlingen) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //10

  let searchFraise = searchArbetsformedlingen;

  const structureSearchFraise = (searchStr) => {
    let tempSearchStr = searchStr;
    tempSearchStr = tempSearchStr.toLowerCase();

    const isReactIncluded = tempSearchStr.includes('react');
    if (!isReactIncluded) {
      tempSearchStr = tempSearchStr += ' react';
    }
    tempSearchStr = tempSearchStr.replace(/ /g, '%20');
    if (tempSearchStr.startsWith('%20')) {
      tempSearchStr = tempSearchStr.substring(3);
    }

    return tempSearchStr;
  };

  /**
   * * New URL "https://jobsearch.api.jobtechdev.se/search?published-after=20160&q=react&resdet=full&offset=0&limit=10&sort=pubdate-desc"
   * info will have hardCode "react" as q value, if no other search words is passed
   *  @param q search word(s)
   *  @param offset  jobs to skip
   *  @param limit  How many jobs to get in response
   *
   * */

  try {
    const url = `https://jobsearch.api.jobtechdev.se/search?published-after=20160&q=${structureSearchFraise(
      searchFraise
    )}&resdet=full&offset=${skip}&limit=${limit}&sort=pubdate-desc`;

    const response = await axios.get(url);

    const {
      hits,
      positions,
      total: { value },
    } = response.data;

    const structureJobs = hits.map((job) => {
      let temp = {};
      temp.company = job.employer.workplace;
      temp.position = job.headline;
      temp.createdAt = job.publication_date;
      temp.jobLocation = job.workplace_address.municipality;
      temp.jobType = job.employment_type.label;
      temp.status = 'pending';
      temp._id = job.id;
      return temp;
    });

    const jobs = await structureJobs;
    const totalJobs = value;
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
  } catch (error) {
    console.log(error.response.data);
    return error.response.data;
  }
};

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  // NO await
  let result = Job.find(queryObject);

  // Chain sort condition
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }
  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //10
  result = result.skip(skip).limit(limit);

  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  // give alias to id
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  //  find _id that matches jobId
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }
  // check permission,
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
  getAllJobsArbetsformedlingen,
};
