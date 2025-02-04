import express from 'express';
import {
    requestPermissionController,
    getPendingRequestsController,
    getRequestByIdController,
    approvePermissionRequestController,
    denyPermissionRequestController,
    getUserPermissionRequestsController
} from '../controllers/permissionRequestController';
import { authAndPermissionMiddleware } from '../middlewares/authAndPermissionMiddleware';

const router = express.Router();

router.post('/', authAndPermissionMiddleware(), requestPermissionController);
router.get('/', authAndPermissionMiddleware('admin'), getPendingRequestsController);
router.get('/:id', authAndPermissionMiddleware('admin'), getRequestByIdController);
router.patch('/:id/approve', authAndPermissionMiddleware('admin'), approvePermissionRequestController);
router.patch('/:id/deny', authAndPermissionMiddleware('admin'), denyPermissionRequestController);
router.get('/user/history', authAndPermissionMiddleware(), getUserPermissionRequestsController);

export default router;
