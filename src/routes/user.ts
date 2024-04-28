import { Router } from 'express';
import { createUser, getAllUser, getUserById, deleteUser } from '../controller/user';

const schemasUser = require('../validate/user.schema');
const middleware = require('../middleware/joi-validate');

// Old node way
// const express = require('express');
// const Router = express.Router;

const router = Router();


router.get('/', getAllUser);

router.get('/:id', getUserById);

router.post('/', createUser);

// router.patch('/:id', updateTodos);

router.delete('/:id', deleteUser);

export default router;