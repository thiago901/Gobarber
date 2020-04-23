import * as Yup from 'yup';
import { isBefore, startOfHour, parseISO, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';
import Notification from '../models/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, resp) {
    const { page = 1 } = req.query;

    const appointment = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,

      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return resp.json(appointment);
  }

  async store(req, resp) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'validation fails' });
    }
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // Check if provider are provider
    if (!isProvider) {
      return resp
        .status(401)
        .json({ error: 'You can only create Appointment with providers' });
    }

    const startHour = startOfHour(parseISO(date));

    // check for past hours
    if (isBefore(startHour, new Date())) {
      return resp.status(400).json({ error: 'Past dates are not permitted' });
    }

    // check date availability
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: startHour,
      },
    });

    if (checkAvailability) {
      return resp
        .status(400)
        .json({ error: 'Appointment date is not availability' });
    }
    const appointment = await Appointment.create({
      date: startHour,
      user_id: req.userId,
      provider_id,
    });

    const user = await User.findByPk(req.userId);
    const dateFormated = format(startHour, "'dia' dd 'de' MMMM 'às' H:mm'h' ", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${dateFormated}`,
      user: provider_id,
    });
    return resp.json(appointment);
  }

  async delete(req, resp) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // eslint-disable-next-line eqeqeq
    if (req.userId != appointment.user_id) {
      return resp
        .status(401)
        .json({ error: "You don't have permition to cancel this appointment" });
    }
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return resp
        .status(401)
        .json({ error: 'You can only cancel appointment 2 hours in advance' });
    }
    appointment.canceled_at = new Date();
    await appointment.save();
    await Queue.add(CancellationMail.key, {
      appointment,
    });
    return resp.json(appointment);
  }
}

export default new AppointmentController();
