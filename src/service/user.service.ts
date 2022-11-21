import { ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import { CreateUserInput, LoginInput, UserModel } from '../schema/user.schema';
import Context from '../types/context';
import { signJwt } from '../utils/jwt';

class UserService {
  async createUser(input: CreateUserInput) {
    // Call user model to create a user
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
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

    // Sign a JWT
    const token = signJwt(user);

    // Set a cookie for the JWT
    context.res.cookie('accessToken', token, {
      maxAge: 3.15e10, // 1 year
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Return the JWT
    return token;
  }
}

export default UserService;
