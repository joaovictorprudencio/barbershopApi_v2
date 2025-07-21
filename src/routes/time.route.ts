import { Router } from "express";
import {
  marchTime,
  timesUnavailable,
  listTimesAvailable,
  uncheckTime
} from "../controllers/time.controller";

import { asyncHandler } from '../util/expressWrapper';

const router = Router();

router.post('/times/march', asyncHandler(marchTime));
router.get('/times/unavailable', asyncHandler(timesUnavailable));
router.get('/times/available', asyncHandler(listTimesAvailable));
router.put('/times/uncheck/:id', asyncHandler(uncheckTime))

export default router;
