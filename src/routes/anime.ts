import { Router } from 'express';
import { createAnime, deleteAnime, getAllAnime, getAnimeById, updateAnime } from '../controller/anime';

const router = Router();

router.get('/', getAllAnime);

router.get('/:id', getAnimeById);

router.post('/', createAnime);

router.put('/:id', updateAnime);

router.delete('/:id', deleteAnime);

export default router;