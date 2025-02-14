import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwtAuth.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';
import { PaginationArgs } from 'src/modules/chats/dto/pagination-chat.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser() user: TokenPayload,
    @Args() paginationArgs: PaginationArgs,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.usersService.findAll(user, search, paginationArgs);
  }

  @Query(() => User, { name: 'user', nullable: true })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('_id', { nullable: true }) _id: string,
    @Args('email', { nullable: true }) email: string,
  ) {
    return this.usersService.findOne({ _id, email });
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.usersService.update(user._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() currentUser: TokenPayload) {
    return currentUser;
  }
}
