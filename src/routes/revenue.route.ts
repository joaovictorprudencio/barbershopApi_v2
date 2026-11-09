import { Router } from "express";
import { asyncHandler } from '../util/expressWrapper';
import {
  findByMonthYear,
  findByYear,
} from "../controllers/revenue.controller";

const router = Router();

router.get('/revenues/:year/:month', asyncHandler(findByMonthYear));
router.get('/revenues/:year', asyncHandler(findByYear));

export default router;
