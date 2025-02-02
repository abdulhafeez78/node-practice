import bcrypt from "bcryptjs";

import { UsersModel } from "./schema/userSchema";
import {
  User,
  UserForCreate,
  userForPresentation,
  UserWithToken,
} from "./model/user.model";
import { JWTService } from "../shared/services/jwt.service";

export class UserService {
  private readonly users: any; // Store the Mongoose model reference
  private readonly mapper: UserMapper;
  constructor() {
    this.users = UsersModel; // Initialize with the Mongoose model
    this.mapper = new UserMapper();
  }

  async create(user: UserForCreate): Promise<User> {
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(user.password, salt);
    user.password = hashPassword;
    const newUser = await this.users.create(user); // Properly call `create()`
    return this.mapper.transform(newUser);
  }

  async login(user: User): Promise<User> {
    const newUser = await this.users.findOne({ email: user.email }); // Properly call `create()`
    const token = await JWTService.generateAuthToken(newUser._id);

    const updateUserWithToken = await this.users.findOneAndUpdate(
      { _id: newUser._id }, // Find user by ID
      { $set: { accessToken: token } }, // Set token field to null
      { new: true } // Return the updated document
    );

    const updatedUser = this.mapper.transform(updateUserWithToken);

    return updatedUser;
  }

  async logout(user: User): Promise<User> {
    const updatedUser = await this.users.findOneAndUpdate(
      { _id: user._id }, // Find user by ID
      { $set: { accessToken: null } }, // Set token field to null
      { new: true } // Return the updated document
    );
    return updatedUser;
  }
}

class UserMapper {
  transform(entity: any): User {
    return {
      _id: entity._id,
      email: entity.email,
      password: entity.password,
      isDeleted: entity.isDeleted,
      accessToken: entity.accessToken,
    };
  }
}
