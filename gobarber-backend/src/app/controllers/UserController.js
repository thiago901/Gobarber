import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, resp) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'validations fails' });
    }
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return resp.status(400).json({ error: 'User already exist' });
    }
    const user = await User.create(req.body);
    return resp.json({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
    });
  }

  async update(req, resp) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confimPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return resp.status(400).json({ error: 'validation fails' });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // eslint-disable-next-line eqeqeq
    if (email && email != user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return resp.status(401).json({ error: 'User alread exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return resp.status(401).json({ error: 'Password not mach' });
    }

    await user.update(req.body);

    const { id, name, provider, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return resp.json({
      id,
      name,
      email,
      provider,
      avatar,
    });
  }
}

export default new UserController();
