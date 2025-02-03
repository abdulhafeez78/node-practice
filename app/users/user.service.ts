import bcrypt from "bcryptjs";

import { UsersModel } from "./schema/userSchema";
import {
  User,
  UserForCreate,
  userForPresentation,
  UserWithToken,
} from "./model/user.model";
import { JWTService } from "../shared/services/jwt.service";
import mongoose from "mongoose";

export class UserService {
  private readonly users: any;
  private readonly mapper: UserMapper;
  constructor() {
    this.users = UsersModel;
    this.mapper = new UserMapper();
  }

  async create(user: UserForCreate): Promise<User> {
    try {
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(user.password, salt);
      user.password = hashPassword;
      const newUser = await this.users.create(user);
      return this.mapper.transform(newUser);
    } catch (e) {
      console.error("Registeratoin error:", e);
      throw new Error("User registeration failed");
    }
  }

  async login(user: User): Promise<User | string> {
    try {
      const newUser = await this.users.findOne({ email: user.email });

      if (!newUser) {
        return "User not found";
      }

      const isPasswordValid = await bcrypt.compare(
        user.password,
        newUser.password
      );

      if (!isPasswordValid) {
        return "Invalid password";
      }

      const token = await JWTService.generateAuthToken(newUser._id);

      const updateUserWithToken = await this.users.findOneAndUpdate(
        { _id: newUser._id },
        { $set: { accessToken: token } },
        { new: true }
      );

      if (!updateUserWithToken) {
        throw new Error("Failed to update user token");
      }

      // Transform the user object before returning
      return this.mapper.transform(updateUserWithToken);
    } catch (e: any) {
      console.error("Login error:", e.message);
      throw new Error(e.message || "Authentication failed");
    }
  }

  async logout(user: User): Promise<string | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(user._id)) {
        return "Id must be a valid mongoId";
      }
      const updatedUser = await this.users.findOneAndUpdate(
        { _id: user._id },
        { $set: { accessToken: null } },
        { new: true }
      );
      if (!updatedUser) {
        return null;
      }
      return "User logged out successfully";
    } catch (e) {
      console.error("Logout error:", e);
      throw new Error("Logout failed");
    }
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
