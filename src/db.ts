import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/UserEntity';
import { Place } from './places/PlaceEntity';
import { Post } from './posts/PostEntity';
import { Comment } from './comments/CommentEntity';
import { Category } from './categories/CategoryEntity';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [User, Place, Post, Comment, Category],
	synchronize: true,
	logging: ['warn', 'error'],
	migrations: [],
	subscribers: [],
});
