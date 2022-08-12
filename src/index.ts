import { AppDataSource } from './data-source';
import User from './entity/User';
import express, { Request, Response } from 'express';
import Post from './entity/Post';
import { validate, Validate } from 'class-validator';

const app = express();

app.use(express.json());

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const user = new User();
    user.name = name;
    user.email = email;
    user.role = role;
    const errors = await validate(user);
    if (errors.length > 0) throw errors;
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ relations: ['posts'] });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findOneBy({ id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.patch('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const { id } = req.params;
    const user = await User.findOneOrFail({ where: { id } });
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOneByOrFail({ id });

    await user.remove();

    res.status(200).json({ message: 'Deleted!' });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const { userId, title, body } = req.body;

    const user = await User.findOneByOrFail({ id: userId });

    const post = new Post({ user, title, body });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ relations: ['user'] });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(5000, () => console.log('App is running on port 5000'));
    // console.log('Inserting a new user into the database...');

    // const user = new User();

    // user.name = 'jane';
    // user.email = 'jane@gmail.com';
    // user.role = 'admin';

    // await AppDataSource.manager.save(user);
  })
  .catch((error) => console.log(error));
