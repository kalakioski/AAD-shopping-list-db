import { Arg, Mutation, Resolver } from 'type-graphql';
import { CreateGroupInput, Group, DeleteGroupInput, UserGroupIdInput } from '../schema/group.schema';
import GroupService from '../service/group.service';

/* TODO: authentication */
@Resolver()
export default class GroupResolver {
  constructor(private groupService: GroupService) {
    this.groupService = new GroupService();
  }

  /* Create new group */
  @Mutation(() => Group)
  createGroup(@Arg('input') input: CreateGroupInput) {
    return this.groupService.createGroup(input, "6395efc0dc0b97cf8335227c");
  }

  /* Remove a group with id */
  @Mutation(() => Boolean)
  deleteGroup(@Arg('input') input: DeleteGroupInput) {
    return this.groupService.deleteGroup(input);
  }

  /* Add user to the group */
  @Mutation(() => Group)
  addUserToGroup(@Arg("input") input: UserGroupIdInput) {
    return this.groupService.addUserToGroup(input);
  }

  /* Remove user from a group */
  @Mutation(() => Group)
  removeUserFromGroup(@Arg("input") input: UserGroupIdInput) {
    return this.groupService.removeUserFromGroup(input);
  }
}
