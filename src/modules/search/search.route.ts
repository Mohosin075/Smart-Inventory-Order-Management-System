import { Router } from 'express'
import { SearchController } from './search.controller'

const router = Router()

router.get('/products', SearchController.searchProducts)

export const SearchRoutes = router