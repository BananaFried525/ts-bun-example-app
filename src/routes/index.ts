import { Router } from 'express';

import { loadRoutesPath, loadEndpoints } from '../utils/route'

const path = loadRoutesPath(__dirname)

const router = loadEndpoints(path)

export default router