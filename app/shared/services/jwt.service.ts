import * as jwt from "jsonwebtoken";

export class JWTService {
  constructor() {}

  public static generateAuthToken = async (
    payload: jwt.JwtPayload
  ): Promise<string> => {
    return jwt.sign({ _id: payload._id.toString() }, "JWT_SECRET").toString();
  };
}
