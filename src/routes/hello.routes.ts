import { Router } from "express";
import {
  getHello,
  postHello,
  putHello,
  deleteHello,
} from "../controllers/hello.controller.js";

const helloRouter = Router();

helloRouter.get("/", getHello);
helloRouter.post("/", postHello);
helloRouter.put("/:id", putHello);
helloRouter.delete("/:id", deleteHello);

export default helloRouter;
