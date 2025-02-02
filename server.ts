import { AppInstance } from "./app";
import express from "express";

class Server {
  private app: express.Application;
  private port;

  constructor() {
    this.app = AppInstance.getApp();
    this.port = 8000;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is listening on ${this.port}`);
    });
  }
}

const server = new Server();
server.start();
