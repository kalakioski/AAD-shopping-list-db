import { ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { CreateUserInput, LoginInput, UserModel, GetUserInput, GetUsersInput } from '../schema/user.schema';
import Context from '../types/context';
import { signJwt } from '../utils/jwt';

class UserService {
  async createUser(input: CreateUserInput) {
    // Call user model to create a user
    return UserModel.create(input);
  }

  /* Get users by name */
  async getUsers(input: GetUsersInput) {
    return await UserModel.find({name: {$regex: '.*' + input.name + '.*' }});
  }

  async getUserById(input: GetUserInput) {
    return await UserModel.findById(input.userId);
  }

  async login(input: LoginInput) {
    const e = 'Invalid email or password';
    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // Validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // Sign a JWT with 10 hour expiration
    const token = signJwt({...user, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 10)});

    // Return the JWT
    return token;
  }
}

export default UserService;
