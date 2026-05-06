import UserStatus from 'src/common/enums/user-status.enum';

export class UpdateUserDto {
  name?: string;
  bio?: string;
  avatar?: string;
  coverPhoto?: string;
  status?: UserStatus;
}
