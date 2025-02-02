import express from "express";
import mongoose from "mongoose";
import { UserController } from "./app/users/user.controller";
import { swaggerSpec } from "./app/swagger";
import swaggerUi from "swagger-ui-express";

class ExpressApp {
  private app: express.Application;
  private userController: UserController;
  constructor() {
    this.app = express();
    this.userController = new UserController();

    this.configureDatabase();
    this.configuration();
    this.routes();
    this.configureSwagger();
  }

  public routes() {
    /**
     * @swagger
     * /api/:
     *   get:
     *     summary: Health check route
     *     description: Returns a simple message to indicate the API is running.
     *     responses:
     *       200:
     *         description: API is running.
     */
    this.app.get("/", (req, res) => {
      res.json({
        message: "Server is running fine",
      });
    });
    this.app.use("/user", this.userController.getRoutes());
  }

  public configuration() {
    this.app.use(express.json());
  }

  public configureSwagger() {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger docs available at http://localhost:8000/api-docs");
  }

  public configureDatabase() {
    mongoose
      .connect(
        "mongodb+srv://abdul-hafeez:3G69pBqFy62HSW8X@hafeez.a2ph5.mongodb.net/practice"
      )
      .then(() => {
        console.log("Database Connected");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public getApp() {
    return this.app;
  }
}

const AppInstance = new ExpressApp();
export { AppInstance };
