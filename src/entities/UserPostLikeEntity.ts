import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/UserEntity';
import { Place } from '../places/PlaceEntity';
import { Article } from '../articles/ArticleEntity';
import { Base } from './BaseEntity';

@Entity('likes')
export class UserLikePosts extends Base {
	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Place)
	@JoinColumn({ name: 'place_id' })
	place: Place;
}
