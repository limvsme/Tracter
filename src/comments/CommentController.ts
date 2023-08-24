import { Request, Response } from 'express';
import { commentService } from './CommentService';
import { IComment } from './CommentSchema';

export const commentController = {
	registComment: async (req: Request, res: Response): Promise<void> => {},
	updateComment: async (req: Request, res: Response): Promise<void> => {},
	deleteComment: async (req: Request, res: Response): Promise<void> => {},
};
