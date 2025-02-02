import { Schema, Document, connection } from "mongoose";
import { USER_MODEL } from "../../constants";

export interface UserDocument extends Document {
  readonly email: string;
  readonly password: string;
}

export const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  accessToken: {
    type: String,
    required: false,
    default: null,
  },
});

export const UsersModel = connection.model(
  USER_MODEL,
  UserSchema,
  "user-collection"
);
