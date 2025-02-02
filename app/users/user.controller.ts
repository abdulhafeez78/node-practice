import { Router, Response, Request } from "express";
import { UserService } from "./user.service"; // Ensure correct import path
import { UserWithToken } from "./model/user.model";

export class UserController {
  private router: Router;
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.router = Router();
    this.setRoutes();
  }

  public setRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: User
     *     description: User authentication API
     */

    /**
     * @swagger
     * /user/register:
     *   post:
     *     summary: Register a new user
     *     tags: [User]
     *     description: Creates a new user account with the provided details.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: "johndoe@example.com"
     *               password:
     *                 type: string
     *                 example: "securepassword"
     *     responses:
     *       201:
     *         description: User registered successfully.
     */
    this.router.post("/register", this.registerUser);

    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: Login user
     *     tags: [User]
     *     description: Authenticates a user and returns a token.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: "johndoe@example.com"
     *               password:
     *                 type: string
     *                 example: "securepassword"
     *     responses:
     *       200:
     *         description: Successfully logged in.
     *
     */
    this.router.post("/login", this.login);

    /**
     * @swagger
     * /user/logout:
     *   post:
     *     summary: Logout user
     *     tags: [User]
     *     description: Logs out a user by invalidating their token.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               _id:
     *                 type: string
     *                 example: "60d0fe4f5311236168a109ca"
     *     responses:
     *       200:
     *         description: Successfully logged out.
     *       401:
     *         description: Unauthorized. Token is missing or invalid.
     */

    this.router.post("/logout", this.logout);
  }

  public getRoutes(): Router {
    return this.router;
  }

  public registerUser = async (req: Request, res: Response): Promise<any> => {
    let response = await this.userService.create(req.body);
    console.log(response);
    return res.status(201).json({
      message: `User has been created`,
    });
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    let response = await this.userService.login(req.body);
    return res.status(200).json({
      message: `logged in successfully!`,
      data: response,
    });
  };

  public logout = async (req: Request, res: Response): Promise<any> => {
    let response = await this.userService.logout(req.body);
    return res.status(200).json({
      message: `logged out successfully!`,
    });
  };
}
