import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Great post! Thanks for sharing.', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
