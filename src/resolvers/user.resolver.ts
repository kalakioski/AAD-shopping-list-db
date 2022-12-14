import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserInput, LoginInput, User, GetUserInput, GetUsersInput } from '../schema/user.schema';
import UserService from '../service/user.service';
import Context from '../types/context';

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String) // Returns the JWT
  login(@Arg('input') input: LoginInput) {
    return this.userService.login(input);
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }

  @Query(() => [User])
  getUsers(@Arg("input") input: GetUsersInput) {
    return this.userService.getUsers(input);
  }

  @Query(() => User, {nullable: true})
  getUser(@Arg("input") input: GetUserInput) {
    return this.userService.getUserById(input);
  }
}
