import { ApolloError } from 'apollo-server';
import { CreateGroupInput, GroupModel, DeleteGroupInput, UserGroupIdInput } from '../schema/group.schema';
import { User, UserModel } from '../schema/user.schema';
import mongoose from 'mongoose';

class GroupService {

  /* Create group, adds the given used to the users field */
  async createGroup(input: CreateGroupInput, userId: User["_id"]) {
    /* TODO: remove when authentication implemented */
    const id = new mongoose.Types.ObjectId(userId);
    return await GroupModel.create({...input, users: [id]});
  }

  /* Delete group, return true if group was deleted, false otherwise */
  async deleteGroup(input: DeleteGroupInput) {
    return !!await GroupModel.findByIdAndDelete(input._id);
  }

  /* Add user to group with group id and user id */
  async addUserToGroup(input: UserGroupIdInput) {

    /* Check for user */
    const user = await UserModel.findById(input.userId);
    if (!user) throw new ApolloError("user not found");

    /* Check for group */
    const group = await GroupModel.findById(input.groupId);
    if (!group) throw new ApolloError("Group not found");

    /* Check if user already in the group */
    if (group.users.includes(user._id)) throw new ApolloError("User is already in the group");

    /* Update group and return the updated version */
    await GroupModel.updateOne(
      {_id: group._id},
      {$set: {users: [...group.users, user._id]}}
    );

    const updatedGroup = await GroupModel.findById(input.groupId);
    return updatedGroup;
  }

  /* Remove user from group with user id and group id */
  async removeUserFromGroup(input: UserGroupIdInput) {

    /* Check for user */
    const user = await UserModel.findById(input.userId);
    if (!user) throw new ApolloError("user not found");

    /* Check for group */
    const group = await GroupModel.findById(input.groupId);
    if (!group) throw new ApolloError("Group not found");

    /* Update group and return the updated version */
    await GroupModel.updateOne(
      {_id: group._id},
      {$set: {users: group.users.filter(u => (u?.toString()) != user._id.toString())}}
    );

    const updatedGroup = await GroupModel.findById(input.groupId);
    return updatedGroup;
  }
}

export default GroupService;
