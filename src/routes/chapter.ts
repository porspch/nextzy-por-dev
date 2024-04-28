import { Router } from 'express';
import { createChapter, deleteChapter, getAllChapter, getChapterById, updateChapter } from '../controller/chapter';

const router = Router();

router.get('/', getAllChapter);

router.get('/:id', getChapterById);

router.post('/', createChapter);

router.put('/:id', updateChapter);

router.delete('/:id', deleteChapter);

export default router;