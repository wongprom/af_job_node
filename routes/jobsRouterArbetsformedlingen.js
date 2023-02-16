import express from 'express';
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
  getAllJobsArbetsformedlingen,
} from '../controllers/jobsController.js';
import testUser from '../middleware/testUser.js';

const router = express.Router();

// router.route('/').post(testUser, createJob).get(getAllJobs);
router.route('/all-jobs-af').post(getAllJobsArbetsformedlingen);
// place before :id
// router.route('/stats').get(showStats);
// router.route('/:id').delete(testUser, deleteJob).patch(testUser, updateJob);

export default router;
