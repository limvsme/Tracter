import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from 'typeorm';

import { Post } from '../posts/PostEntity';
import { Place } from '../places/PlaceEntity';

enum roleEnum {
	ADMIN = 'admin',
	MEMBER = 'member',
}

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { nullable: false })
	email: string;

	@Column('varchar', { nullable: false })
	nickname: string;

	@Column('varchar', { nullable: false })
	password: string;

	// manytomnay -> like테이블 만들기
	@Column('simple-array')
	@OneToMany(() => Place, place => place.id)
	@JoinColumn({ name: 'place_id' })
	likedPlaces: Place[];

	@Column('simple-array')
	@OneToMany(() => Post, post => post.id)
	@JoinColumn({ name: 'post_id' })
	likedPosts: Post[];

	@Column('enum', {
		enum: roleEnum,
		default: roleEnum.MEMBER,
	})
	role: roleEnum;

	@Column({ default: false })
	isDeleted: boolean;

	@Column('varchar', {})
	token: string;

	@CreateDateColumn({
		type: 'datetime',
		nullable: false,
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: 'datetime',
		nullable: false,
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date;
}
