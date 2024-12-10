import { Controller, Patch, UseInterceptors, Request, UploadedFile, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidRoles } from '../../domain/models/valid-roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFilterHelper } from './helpers/imageFilter.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { Express } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(ValidRoles.admin)
  @Patch()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFilterHelper, // Only valid image extensions
      limits: { fileSize: 4 * 1024 * 1024 }, // 4MB limit
    }),
  )
  async updateUser(
    @Request() request,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(request.user.id, updateUserDto, file);
  }
}
