import { ApolloError } from 'apollo-server';
import { CreateGroupInput, GroupModel, DeleteGroupInput, UserGroupIdInput } from '../schema/group.schema';
import { User, UserModel } from '../schema/user.schema';
import mongoose from 'mongoose';

/* when managing group members, the id of the managed user is always in the input.
The user id outside of input type always comes from context (current user) */
class GroupService {

  /* Create group, adds the given used to the users field */
  async createGroup(input: CreateGroupInput, currentUser: User) {
    return await GroupModel.create({...input, users: [currentUser]});
  }

  /* Delete group, return true if group was deleted, false otherwise */
  async deleteGroup(input: DeleteGroupInput, currentUser: User) {

    /* Check for group and that the user is in the group */
    const group = await GroupModel.findById(input._id);
    if (!group) throw new ApolloError("Group not found");
    const userIds = group.users.map(u => u._id.toString());
    if (!userIds.includes(currentUser._id)) throw new ApolloError("You can only delete your own groups");

    return !!await GroupModel.findByIdAndDelete(input._id);
  }

  /* Add user to group with group id and user id */
  async addUserToGroup(input: UserGroupIdInput, currentUser: User) {

    /* Check for user */
    const user = await UserModel.findById(input.userId);
    if (!user) throw new ApolloError("user not found");

    /* Check for group */
    const group = await GroupModel.findById(input.groupId);
    if (!group) throw new ApolloError("Group not found");
    const userIds = group.users.map(u => u._id.toString());
    if (!userIds.includes(currentUser._id)) throw new ApolloError("You can only edit your own groups");

    /* Check if user already in the group */
    if (userIds.includes(user._id.toString())) throw new ApolloError("User is already in the group");

    /* Update group and return the updated version */
    await GroupModel.updateOne(
      {_id: group._id},
      {$set: {users: [...group.users, user]}}
    );

    const updatedGroup = await GroupModel.findById(input.groupId);
    return updatedGroup;
  }

  /* Remove user from group with user id and group id */
  async removeUserFromGroup(input: UserGroupIdInput, currentUser: User) {

    /* Check for user */
    const user = await UserModel.findById(input.userId);
    if (!user) throw new ApolloError("user not found");

    /* Check for group */
    const group = await GroupModel.findById(input.groupId);
    if (!group) throw new ApolloError("Group not found");
    const userIds = group.users.map(u => u._id.toString());
    if (!userIds.includes(currentUser._id)) throw new ApolloError("You can only edit your own groups");

    /* Update group and return the updated version */
    await GroupModel.updateOne(
      {_id: group._id},
      {$set: {users: group.users.filter(u => (u._id?.toString()) != user._id.toString())}}
    );

    const updatedGroup = await GroupModel.findById(input.groupId);
    return updatedGroup;
  }

  /* Users own groups */
  async myGroups(userId: User["_id"]) {
    const groups = await GroupModel.find({users: {$in: [new mongoose.Types.ObjectId(userId)]}});
    return groups;
  }
}

export default GroupService;
