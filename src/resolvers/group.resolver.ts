import { ApolloError } from 'apollo-server';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateGroupInput, Group, DeleteGroupInput, UserGroupIdInput } from '../schema/group.schema';
import GroupService from '../service/group.service';
import Context from '../types/context';

@Resolver()
export default class GroupResolver {
  constructor(private groupService: GroupService) {
    this.groupService = new GroupService();
  }

  /* Create new group */
  @Mutation(() => Group)
  createGroup(@Arg('input') input: CreateGroupInput, @Ctx() context: Context) {
    if (!context.user) throw new ApolloError("You need to be logged in to create groups");
    return this.groupService.createGroup(input, context.user._id);
  }

  /* Remove a group with id */
  @Mutation(() => Boolean)
  deleteGroup(@Arg('input') input: DeleteGroupInput, @Ctx() context: Context) {
    if (!context.user) throw new ApolloError("You need to be logged in to delete groups");
    return this.groupService.deleteGroup(input, context.user._id);
  }

  /* Add user to the group */
  @Mutation(() => Group)
  addUserToGroup(@Arg("input") input: UserGroupIdInput, @Ctx() context: Context) {
    if (!context.user) throw new ApolloError("You need to be logged in to edit groups");
    return this.groupService.addUserToGroup(input, context.user._id);
  }

  /* Remove user from a group */
  @Mutation(() => Group)
  removeUserFromGroup(@Arg("input") input: UserGroupIdInput, @Ctx() context: Context) {
    if (!context.user) throw new ApolloError("You need to be logged in to edit groups");
    return this.groupService.removeUserFromGroup(input, context.user._id);
  }
}
