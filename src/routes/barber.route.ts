import { Router } from 'express';
import { asyncHandler } from '../util/expressWrapper';
import { login, createBarber } from '../controllers/barber.controller';

const routerBarber = Router();

routerBarber.post('/barbers/login', asyncHandler(login));
routerBarber.post('/barbers', asyncHandler(createBarber));

export default routerBarber;