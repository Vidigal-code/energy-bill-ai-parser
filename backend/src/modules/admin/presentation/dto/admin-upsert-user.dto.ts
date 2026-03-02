import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { APP_ROLE_ENUM } from '../../../auth/domain/role.type';
import type { AppRole } from '../../../auth/domain/role.type';

export class AdminCreateUserDto {
  @ApiProperty({ example: 'user@local.test' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'usuario_admin', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ example: 'Admin@123456', minLength: 8, maxLength: 100 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  @Matches(/[^A-Za-z0-9]/)
  password!: string;

  @ApiPropertyOptional({ enum: APP_ROLE_ENUM, example: 'USER' })
  @IsOptional()
  @IsEnum(APP_ROLE_ENUM)
  role?: AppRole;
}

export class AdminUpdateUserDto {
  @ApiPropertyOptional({
    example: 'usuario_editado',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({
    example: 'Admin@123456',
    minLength: 8,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  @Matches(/[^A-Za-z0-9]/)
  password?: string;

  @ApiPropertyOptional({ enum: APP_ROLE_ENUM, example: 'ADMIN' })
  @IsOptional()
  @IsEnum(APP_ROLE_ENUM)
  role?: AppRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
