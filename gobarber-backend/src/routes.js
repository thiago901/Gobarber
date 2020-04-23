import { Router } from 'express';
import multer from 'multer';
import userController from './app/controllers/UserController';
import fileController from './app/controllers/FileController';
import sessionController from './app/controllers/SessionController';
import providerController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
import authMidleware from './app/middleware/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', userController.store);
routes.post('/session', sessionController.store);

routes.use(authMidleware);
routes.put('/users', userController.update);
routes.post('/files', upload.single('file'), fileController.store);

routes.get('/providers', providerController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post('/appointment', AppointmentController.store);
routes.get('/appointment', AppointmentController.index);
routes.delete('/appointment/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);
export default routes;
