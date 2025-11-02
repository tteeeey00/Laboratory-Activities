import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated Post Title', description: 'Post title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated content...', description: 'Post content', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}
