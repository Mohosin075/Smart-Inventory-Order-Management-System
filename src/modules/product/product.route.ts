import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();

router.get('/categories', ProductController.listCategories);
router.post('/categories', ProductController.createCategory);

router.post('/products', ProductController.createProduct);
router.get('/', ProductController.listProducts);
router.get('/:id', ProductController.getProduct);
router.patch('/:id', ProductController.updateProduct);
router.patch('/:id/restock', ProductController.restockProduct);

export const ProductRoutes = router;