import { DeleteResult, UpdateResult } from 'typeorm';
import { Article, subjectEnum } from './ArticleEntity';
import { User } from '../users/UserEntity';
import { UserLikeArticles } from '../entities/UserLikeArticlesEntity';
import { userService } from '../users/UserService';

export const articleService = {
	// 글 등록
	createArticle: async (
		userId: number,
		subject: subjectEnum,
		writer: string,
		title: string,
		contents: string,
		placeImage: string
	): Promise<Article> => {
		const isUser = await userService.getUserById(userId);

		if (!isUser) {
			throw new Error(`createPlace: 관리자만 숙소를 등록할 수 있습니다.`);
		}
		try {
			const newArticle: Article = new Article();
			newArticle.subject = subject;
			newArticle.writer = writer;
			newArticle.title = title;
			newArticle.contents = contents;
			newArticle.placeImage = placeImage;
			return Article.save(newArticle);
		} catch (error) {
			throw new Error('createArticle: 게시글 등록에 실패했습니다.');
		}
	},
	// 게시글 검색(id)
	getArticleById: async (id: number): Promise<Article | null> => {
		return await Article.findOne({ where: { id } });
	},
	// 게시글 전체 조회
	getAllArticleName: async (): Promise<Article[]> => {
		return await Article.find();
	},
	// 게시글 수정
	updateArticle: async (
		userId: number,
		id: number,
		title: string,
		contents: string
	): Promise<UpdateResult> => {
		try {
			const user = await userService.getUserById(userId);

			if (!user) {
				throw new Error('updateUser: 사용자를 찾을 수 없습니다.');
			}

			const article = await articleService.getArticleById(id);

			if (!article) {
				throw new Error('updateArticle: 게시글을 찾을 수 없습니다.');
			}
			article.title = title;
			article.contents = contents;

			return Article.update({ id }, { title, contents });
		} catch (error) {
			throw new Error('updateArticle: 게시글 수정에 실패했습니다.');
		}
	},
	// 게시글 삭제
	deleteArticle: async (userId: number, id: number): Promise<DeleteResult> => {
		try {
			const user = await userService.getUserById(userId);

			if (!user) {
				throw new Error('updateUser: 사용자를 찾을 수 없습니다.');
			}

			const deleteResult = await Article.delete({ id });

			if (deleteResult.affected === 0) {
				throw new Error('deleteArticle: 삭제할 게시글이 존재하지 않습니다.');
			}

			return deleteResult;
		} catch (error) {
			throw new Error('deleteCategory: 카테고리 삭제에 실패했습니다.');
		}
	},
	// 좋아요 카운트 수정
	updateLikeArticleCounter: async (
		article: Article,
		increment: number
	): Promise<void> => {
		try {
			article.articleLikeCount += increment;
			await Article.save(article);
		} catch (error) {
			throw new Error(error.message);
		}
	},

	// 장소 좋아요 또는 좋아요 취소
	likeArticle: async (
		likeUser: User,
		article: Article,
		like: boolean
	): Promise<void> => {
		try {
			const userLikedArticle = await UserLikeArticles.find({
				where: { user: { id: likeUser.id }, article: { id: article.id } },
			});

			if (like && userLikedArticle) {
				throw new Error('이미 좋아요한 게시글입니다.');
			}

			if (!like && !userLikedArticle) {
				throw new Error('이미 좋아요 취소한 게시글입니다.');
			}

			if (like) {
				const userLike = new UserLikeArticles();
				userLike.user = likeUser;
				userLike.article = article;

				await UserLikeArticles.save(userLike);
				await articleService.updateLikeArticleCounter(article, 1);
			} else {
				UserLikeArticles.remove(userLikedArticle);
				await articleService.updateLikeArticleCounter(article, -1);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
