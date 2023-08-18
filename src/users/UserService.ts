import User, { IUser } from './UserSchema';

export const userService = {
	createUser: async (userData: IUser): Promise<IUser> => {
		try {
			const newUser: IUser = new User(userData);
			return newUser.save();
		} catch (error) {
			throw error;
		}
	},
};
