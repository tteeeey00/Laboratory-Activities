import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId: user.id,
    });
    return this.postRepository.save(post);
  }

  async findAll(page: number = 1, limit: number = 10, sortBy: string = 'createdAt') {
    const skip = (page - 1) * limit;
    
    const orderOptions: any = {};
    if (sortBy === 'popular') {
      orderOptions.likes = 'DESC';
    } else if (sortBy === 'recent') {
      orderOptions.createdAt = 'DESC';
    } else {
      orderOptions.createdAt = 'DESC';
    }
    
    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['author', 'comments'],
      order: orderOptions,
      skip,
      take: limit,
    });

    return {
      data: posts.map(post => ({
        ...post,
        author: {
          id: post.author.id,
          username: post.author.username,
        },
        commentsCount: post.comments?.length || 0,
        likes: post.likes || 0,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    const post = await this.findOne(id);

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
  }

  async likePost(id: number): Promise<Post> {
    const post = await this.findOne(id);
    post.likes = (post.likes || 0) + 1;
    return this.postRepository.save(post);
  }
}
