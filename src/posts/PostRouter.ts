import { Router } from "express";
import postController from "./PostController";

const postRouter = Router();

// 게시글 목록 조회
postRouter.get('/posts',postController.listPost);
// 게시글 등록
postRouter.post('/posts',postController.registePost);
// 게시글 상세 조회
postRouter.get('/posts/:postId',postController.openPost);
// 게시글 수정
postRouter.patch('/posts/:postId',postController.updatePost);
// 게시글 삭제
postRouter.delete('/posts/:postId',postController.deletePost);
