import UserResolver from './user.resolver';
import GroupResolver from './group.resolver';

export const resolvers = [UserResolver, GroupResolver] as const;
