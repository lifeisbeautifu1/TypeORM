import 'reflect-metadata';
import { DataSource } from 'typeorm';
import User from './entity/User';
import Post from './entity/Post';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'harry',
  password: '89179645957',
  database: 'harry',
  synchronize: true,
  logging: true,
  entities: [User, Post],
  migrations: [],
  subscribers: [],
});
