import { CreateGroupInput, GroupModel, DeleteGroupInput } from '../schema/group.schema';

class GroupService {
  async createGroup(input: CreateGroupInput) {
    return GroupModel.create(input);
  }
  async deleteGroup(input: DeleteGroupInput) {
    return !!await GroupModel.findByIdAndDelete(input._id);
  }
}

export default GroupService;
