import { Router } from 'express';
import * as AssetController from './asset.controller.js';

const router = Router();


router.get('/', AssetController.list);


router.get('/:id', AssetController.getOne);


router.post('/', AssetController.create);


router.put('/:id', AssetController.update);


router.delete('/:id', AssetController.remove);

export default router;