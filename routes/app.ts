import { Router, type Response, type NextFunction } from 'express';
import authenticationMiddleware from '../middleware/authenticateToken';

const router = Router();

router.get('/protected', authenticationMiddleware.authenticateToken, (req, res: Response, next: NextFunction) => {
    // This route is protected and can only be accessed if the token is valid
    res.send('Protected route');
});

export default router