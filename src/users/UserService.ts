// import User, { IUser } from './UserSchema';
import { User } from './UserEntity';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const userService = {
	// Email 중복 검사
	isDuplicateEmail: async (email: string): Promise<boolean> => {
		return (await User.findOne({ where: { email } })) ? true : false;
	},

	// 닉네임 중복 검사
	isDuplicateNickname: async (nickname: string): Promise<boolean> => {
		return (await User.findOne({ where: { nickname } })) ? true : false;
	},

	// 회원가입
	createUser: async (
		email: string,
		password: string,
		nickname: string
	): Promise<User> => {
		try {
			const isDuplicateEmail: boolean = await userService.isDuplicateEmail(
				email
			);
			const isDuplicateNickname: boolean =
				await userService.isDuplicateNickname(nickname);
			// const token: string = await userService.createToken(token);
			if (isDuplicateEmail) {
				throw new Error('이미 사용 중인 이메일 입니다.');
			}

			if (isDuplicateNickname) {
				throw new Error('이미 사용 중인 닉네임입니다.');
			}

			const hashedPassword: string = await bcrypt.hash(password, 5);

			const newUser: User = new User();
			newUser.email = email;
			newUser.password = hashedPassword;
			newUser.nickname = nickname;
			// newUser.token = token;
			return newUser.save();
		} catch (error) {
			throw new Error('회원가입 실패');
		}
	},

	// 토큰 생성하기
	createToken: async (user: User): Promise<string> => {
		try {
			if (typeof process.env.SECRET_KEY !== 'string') {
				throw new Error('토큰 생성 실패: SECRET_KEY가 설정되어 있지 않습니다.');
			}

			const token: string = jwt.sign(
				{ userId: user.id },
				process.env.SECRET_KEY,
				{
					// 토큰의 유효 기간 설정(1일)
					expiresIn: '1d',
				}
			);

			return token;
		} catch (error) {
			throw new Error('토큰 생성 실패: 토큰이 생성되지 않습니다.');
		}
	},

	//로그인
	login: async (email: string, password: string): Promise<string> => {
		const user = await userService.getUserByEmail(email);

		if (!user) {
			throw new Error('입력하신 이메일은 회원가입되어 있지 않습니다.');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			throw new Error('비밀번호가 일치하지 않습니다.');
		}

		const token = await userService.createToken(user);

		if (!token) {
			throw new Error('토큰이 생성되지 않습니다.');
		}
		return token;
	},

	// Email 검색하기
	getUserByEmail: async (email: string): Promise<User | null> => {
		return await User.findOne({ where: { email } });
	},
	// Nickname 검색하기
	getUserByNickname: async (nickname: string): Promise<User | null> => {
		return await User.findOne({ where: { nickname } });
	},

	// 회원 정보 불러오기 => 이거 email 검색하기랑 완전히 같은 코드인데 이래도 되나 싶음..
	getUserInfo: async (email: string): Promise<User | null> => {
		return await User.findOne({ where: { email } });
	},

	// 회원 정보 업데이트하기
	updateUser: async (
		email: string,
		nickname: string,
		password: string,
		updatePassword: string
	): Promise<User | null> => {
		try {
			const user = await userService.getUserInfo(email);

			if (!user) {
				throw new Error('사용자를 찾을 수 없습니다.');
			}

			const isValidPassword = await bcrypt.compare(password, user.password);
			const isDuplicateNickname = await userService.getUserByNickname(nickname);
			const updateUser: User = new User();

			// 이럼 비밀번호가 틀릴경우 업데이트가 진행되지 않으려고 하는데 password를 2개를 받아야하나?
			if (!isValidPassword) {
				throw new Error(
					'비밀번호가 일치하지 않아 회원정보를 업데이트할 수 없습니다.'
				);
			}

			// 닉네임이 중복되어 있는지 확인하는건데 현재 상태면 자기 닉네임도 자기와 비교하는거 아님??
			// 업데이트 시 내 닉네임 변화를 원치 않을 경우
			if (isDuplicateNickname) {
				throw new Error('사용중인 닉네임입니다.');
			}
			updateUser.nickname = nickname;

			// 이렇게 하는게 맞나 모르겠음.
			//이미 비밀번호는 hash가 되어있잔슴. 이걸 비교하려면 디코드가 필요할거 같아서 해볼려고 했는데 이게 맞는지 모르겠음

			if (updatePassword !== password) {
				const hashedPassword: string = await bcrypt.hash(updatePassword, 5);
				updateUser.password = hashedPassword;
			}
			// update가 안먹음... 이렇게 해도되나? 덮어쓰기가 되나? 잘 모르겠음.
			// return updateUser.update({email}, {nickname: updateUser.nickname, password: updateUser.password})
			return updateUser.save();
		} catch (error) {
			throw new Error('회원 정보 업데이트 실패');
		}
	},

	// 회원 탈퇴하기
	deleteUser: async (email: string): Promise<void> => {
		try {
			await User.update({ email }, { isDeleted: true });
		} catch (error) {
			throw new Error('회원탈퇴 실패');
		}
	},
};
