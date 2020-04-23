import Notification from '../models/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, resp) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return resp
        .statu(400)
        .json({ error: 'Only provider can load notifications' });
    }
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return resp.json(notifications);
  }

  async update(req, resp) {
    // const notification = Notification.findOne({ id: req.params.id });

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return resp.json(notification);
  }
}

export default new NotificationController();
