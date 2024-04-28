import { Router } from 'express';
import { createStudio, deleteStudio, getAllStudio, getStudioById, updateStudio } from '../controller/studio';

const router = Router();

router.get('/', getAllStudio);

router.get('/:id', getStudioById);

router.post('/', createStudio);

router.put('/:id', updateStudio);

router.delete('/:id', deleteStudio);

export default router;