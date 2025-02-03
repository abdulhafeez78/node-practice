import { Router, Response, Request } from "express";
import { UserService } from "./user.service"; // Ensure correct import path
import { UserForCreate, UserWithToken } from "./model/user.model";

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
     *       400:
     *         description: Invalid username or password
     */
    this.router.post("/login", this.login);

    /**
     * @swagger
     * /user/logout:
     *   post:
     *     summary: Logout user
     *     tags: [User]
     *     description: Logs out a user.
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
    const validateData = await this.validate(req.body);
    if (validateData == null) {
      let response = await this.userService.create(req.body);
      console.log(response);
      return res.status(201).json({
        message: `User has been created`,
      });
    } else {
      return res.status(200).send(validateData);
    }
  };

  public login = async (req: Request, res: Response): Promise<any> => {
    let response = await this.userService.login(req.body);

    if (typeof response == "string") {
      return res.status(400).send(response);
    } else {
      return res.status(200).json({
        message: `logged in successfully!`,
        data: response,
      });
    }
  };

  public logout = async (req: Request, res: Response): Promise<any> => {
    let response = await this.userService.logout(req.body);

    if (response == "Id must be a valid mongoId") {
      return res.status(400).json({
        message: `Id must be a valid mongoId`,
      });
    } else if (response != null) {
      return res.status(200).json({
        message: `logged out successfully!`,
      });
    } else {
      return res.status(400).json({
        message: `Error in logging out`,
      });
    }
  };

  public validate = async (user: UserForCreate): Promise<string | null> => {
    const { email, password } = user;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email || !emailRegex.test(email)) {
      return "Invalid email format. Please enter a valid email address.";
    }

    if (!password || !passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and contain at least one letter and one number.";
    }

    return null; // No errors, validation passed
  };
}
