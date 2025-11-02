import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async create(postId: string, createCommentDto: CreateCommentDto, user: UserDocument): Promise<Comment> {
    // Check if post exists
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comment = new this.commentModel({
      ...createCommentDto,
      postId: new Types.ObjectId(postId),
      authorId: user._id,
    });

    await comment.save();
    return comment;
  }

  async findByPost(postId: string): Promise<any[]> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const comments = await this.commentModel
      .find({ postId: new Types.ObjectId(postId) })
      .populate('authorId', 'username')
      .sort({ createdAt: -1 })
      .exec();

    return comments.map(comment => ({
      id: String(comment._id),
      content: comment.content,
      authorId: String((comment.authorId as any)._id),
      createdAt: comment.createdAt,
      author: {
        id: String((comment.authorId as any)._id),
        username: (comment.authorId as any).username,
      },
    }));
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: UserDocument): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.authorId.toString() !== String(user._id)) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    await comment.save();
    return comment;
  }

  async remove(id: string, user: UserDocument): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.authorId.toString() !== String(user._id)) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndDelete(id);
  }
}
