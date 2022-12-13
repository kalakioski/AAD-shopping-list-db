import { Arg, Mutation, Resolver } from 'type-graphql';
import { CreateGroupInput, Group, DeleteGroupInput } from '../schema/group.schema';
import GroupService from '../service/group.service';

@Resolver()
export default class GroupResolver {
  constructor(private groupService: GroupService) {
    this.groupService = new GroupService();
  }

  /* Create new group */
  @Mutation(() => Group)
  createGroup(@Arg('input') input: CreateGroupInput) {
    return this.groupService.createGroup(input);
  }

  /* Remove a group with id */
  @Mutation(() => Boolean)
  deleteGroup(@Arg('input') input: DeleteGroupInput) {
    return this.groupService.deleteGroup(input);
  }
}
