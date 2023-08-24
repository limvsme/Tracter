import { Request, Response } from 'express';
import { userService } from './UserService';
import { User } from './UserEntity';

export const userController = {
	registeUser: async (req: Request, res: Response): Promise<Response> => {
		const { email, password, nickname }: User = req.body;

		try {
			if (!email || !password || !nickname) {
				return res.status(400).json({ message: '누락된 값이 있습니다.' });
			}

			await userService.createUser(email, nickname, password);
			return res.status(201).json({ message: '회원 가입이 완료되었습니다.' });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	getUserInformation: async (
		req: Request,
		res: Response
	): Promise<Response> => {
		try {
			const { email } = req.params;
			const user = await userService.getUserInfo(email);

			if (!user) {
				return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
			}
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	userLogin: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email, password }: User = req.body;
			const token = await userService.login(email, password);

			return res.status(201).json({ message: '로그인에 성공했습니다.', token });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	updateProfile: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email }: User = req.body;
			const { nickname, password, updatePassword } = req.params;

			const user = await userService.getUserByEmail(email);

			if (!user) {
				return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
			}

			await userService.updateUser(email, nickname, password, updatePassword);

			return res.status(200).json({ message: '회원정보 수정에 성공했습니다.' });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	validatorEmail: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email }: User = req.body;
			const isDuplicateEmail = await userService.getUserByEmail(email);

			if (isDuplicateEmail) {
				return res
					.status(400)
					.json({ message: '이미 사용 중인 이메일입니다.' });
			}
			return res.status(200).json({ message: '사용 가능한 이메일입니다.' });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	validatorNickname: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { nickname }: User = req.body;
			const isDuplicateNickname = await userService.getUserByNickname(nickname);

			if (isDuplicateNickname) {
				return res
					.status(400)
					.json({ message: '이미 사용 중인 닉네임입니다.' });
			}
			return res.status(200).json({ message: '사용 가능한 닉네임입니다.' });
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	},
	withdrawUser: async (req: Request, res: Response): Promise<Response> => {
		try {
			const { email }: User = req.body;

			await userService.deleteUser(email);
			return res.status(200).json({ message: '회원탈퇴에 성공했습니다.' });
		} catch (error) {
			if (error.message === '회원 탈퇴 실패') {
				return res
					.status(400)
					.json({ message: '토큰이 일치하지 않아 회원탈퇴 실패했습니다.' });
			}
			return res.status(500).json({ error: error.message });
		}
	},
};
