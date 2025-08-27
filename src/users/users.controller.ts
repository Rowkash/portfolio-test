import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { DeleteUserDto } from '@/users/dto/delete-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserModel } from '@/users/models/user.model';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getOne({ id });

    return plainToInstance(UserModel, user, { excludeExtraneousValues: true });
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async remove(
    @Req() { user }: ICustomRequest,
    @Body() { password }: DeleteUserDto,
  ) {
    const { id } = user as IRequestUser;
    await this.usersService.remove({ id, password });
  }
}
