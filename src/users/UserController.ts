import { Request, Response } from 'express';
import { userService } from './UserService';
import { IUser } from './UserSchema';

export const userController = {
	registeUser: async (req: Request, res: Response): Promise<Response> => {
		const userData: IUser = req.body;

		try {
			const newUser: IUser = await userService.createUser(userData);
			return res.status(201).json(newUser);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},

	getUserInformation: async (req: Request, res: Response): Promise<void> => {},
	userLogin: async (req: Request, res: Response): Promise<void> => {},
	updateProfile: async (req: Request, res: Response): Promise<void> => {},
	validatorEmail: async (req: Request, res: Response): Promise<void> => {},
	validatorNickname: async (req: Request, res: Response): Promise<void> => {},
	withdrawUser: async (req: Request, res: Response): Promise<void> => {},
};
