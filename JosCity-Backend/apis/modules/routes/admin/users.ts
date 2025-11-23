import express, { Router } from 'express';
import * as userController from '../../controllers/admin/userController';
import { adminAuth } from '../../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', adminAuth, userController.getUsers);
router.get('/:id', adminAuth, userController.getUser);
router.post('/:id/approve', adminAuth, userController.approveUser);
router.post('/:id/ban', adminAuth, userController.banUser);
router.post('/:id/unban', adminAuth, userController.unbanUser);
router.post('/:id/verify', adminAuth, userController.verifyUser);
router.put('/:id/group', adminAuth, userController.updateUserGroup);
router.delete('/:id', adminAuth, userController.deleteUser);

export default router;

