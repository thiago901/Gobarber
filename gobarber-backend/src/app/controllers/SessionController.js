import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import File from '../models/File';
import auth from '../../config/auth';

class SessionController {
  async store(req, resp) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'validation fails' });
    }
    const user = await User.findOne({
      where: { email: req.body.email },
      include: [
        { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
      ],
    });

    if (!user) {
      return resp.status(401).json({ error: 'User invalid' });
    }
    if (!(await user.checkPassword(req.body.password))) {
      return resp.status(401).json({ error: 'Password invalid' });
    }
    const { id, name, email, avatar, provider } = user;
    return resp.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expiresIn,
      }),
    });
  }
}

export default new SessionController();
