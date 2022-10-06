import express from 'express';
import { protect } from '../middlewares/protectMiddleware.js';
import { allowedTo } from '../middlewares/roleMiddleware.js';
import {
  createNewCategory,
  deleteCategory,
  getCategory,
  updateCategory,
  getCategories,
} from '../controllers/categoryController.js';
import {
  createCategoryValidator,
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} from '../utils/validators/categoryValidator.js';

const router = express.Router();

router.use(protect, allowedTo('admin'));

router.post('/', createCategoryValidator, createNewCategory);

router.get('/:id', getCategoryValidator, getCategory);

router.get('/', getCategories);

router.patch('/:id', updateCategoryValidator, updateCategory);

router.delete('/:id', deleteCategoryValidator, deleteCategory);

export { router as categoryRoute };
