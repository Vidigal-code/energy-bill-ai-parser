import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PtBrMessages } from '../../../../shared/messages/pt-br.messages';

export class RegisterDto {
  @ApiProperty({ example: 'user@local.test' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'usuario_teste', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ example: 'Admin@123456', minLength: 8, maxLength: 100 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/[A-Z]/, {
    message: PtBrMessages.auth.passwordMustContainUppercase,
  })
  @Matches(/[a-z]/, {
    message: PtBrMessages.auth.passwordMustContainLowercase,
  })
  @Matches(/[0-9]/, {
    message: PtBrMessages.auth.passwordMustContainNumber,
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: PtBrMessages.auth.passwordMustContainSpecialChar,
  })
  password!: string;
}
