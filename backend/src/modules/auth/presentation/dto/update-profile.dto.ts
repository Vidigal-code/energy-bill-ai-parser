import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PtBrMessages } from '../../../../shared/messages/pt-br.messages';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
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
  password?: string;
}
