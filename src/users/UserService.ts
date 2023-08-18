import User, { IUser } from './UserSchema';

export const userService = {
	createUser: async (
		email: string,
		password: string,
		nickname: string
	): Promise<IUser> => {
		try {
			const newUser: IUser = new User({ email, password, nickname });
			return newUser.save();
		} catch (error) {
			throw error;
		}
	},
	// Email 검색하기
	getUserByEmail: async (email: string): Promise<IUser> => {
		return User.findOne({ email });
	},
	// Nickname 검색하기
	getUserByNickname: async (nickname: string): Promise<IUser> => {
		return User.findOne({ nickname });
	},
	// 회원 탈퇴하기
	deleteUser: async (email: string): Promise<void> => {
		try {
			await User.deleteOne({ email });
		} catch (error) {
			throw new Error('회원탈퇴 실패');
		}
	},
};
