import { Router } from 'express';
import logger from '../../utils/logger';

const router = Router();

router.get('/', (req, res) => {
  logger.info('Hello, World!')
  res.json({ message: 'Hello, World!' });
  return
})

export default router