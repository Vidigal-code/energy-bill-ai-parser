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
import { APP_ROLE_ENUM } from '../../../auth/domain/role.type';
import type { AppRole } from '../../../auth/domain/role.type';

export class AdminCreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  @Matches(/[^A-Za-z0-9]/)
  password!: string;

  @IsOptional()
  @IsEnum(APP_ROLE_ENUM)
  role?: AppRole;
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  @Matches(/[^A-Za-z0-9]/)
  password?: string;

  @IsOptional()
  @IsEnum(APP_ROLE_ENUM)
  role?: AppRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
