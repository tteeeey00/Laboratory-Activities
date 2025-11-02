import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserDocument): Promise<Post> {
    const post = new this.postModel({
      ...createPostDto,
      authorId: user._id,
    });
    await post.save();
    return post;
  }

  async findAll(page: number = 1, limit: number = 10, sortBy: string = 'createdAt') {
    const skip = (page - 1) * limit;
    
    let sortOptions: any = {};
    if (sortBy === 'popular') {
      sortOptions = { likes: -1 };
    } else if (sortBy === 'recent') {
      sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    const [posts, total] = await Promise.all([
      this.postModel
        .find()
        .populate('authorId', 'username')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(),
    ]);

    // Get comment counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await this.postModel.db.collection('comments').countDocuments({ postId: post._id });
        return {
          id: String(post._id),
          title: post.title,
          content: post.content,
          authorId: String((post.authorId as any)._id),
          likes: post.likes || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          author: {
            id: String((post.authorId as any)._id),
            username: (post.authorId as any).username,
          },
          commentsCount,
        };
      })
    );

    return {
      data: postsWithCounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const post = await this.postModel
      .findById(id)
      .populate('authorId', 'username')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Get comments for this post
    const comments = await this.postModel.db
      .collection('comments')
      .aggregate([
        { $match: { postId: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: '$author' },
        {
          $project: {
            id: { $toString: '$_id' },
            content: 1,
            authorId: { $toString: '$authorId' },
            createdAt: 1,
            author: {
              id: { $toString: '$author._id' },
              username: '$author.username',
            },
          },
        },
      ])
      .toArray();

    return {
      id: String(post._id),
      title: post.title,
      content: post.content,
      authorId: String(post.authorId._id || post.authorId),
      likes: post.likes || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: String((post.authorId as any)._id),
        username: (post.authorId as any).username,
      },
      comments,
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: UserDocument): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.authorId.toString() !== String(user._id)) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    await post.save();
    return post;
  }

  async remove(id: string, user: UserDocument): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.authorId.toString() !== String(user._id)) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndDelete(id);
  }

  async likePost(id: string): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    post.likes = (post.likes || 0) + 1;
    await post.save();
    return post;
  }
}
