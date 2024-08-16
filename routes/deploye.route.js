import express from "express";
import { deployeController } from "../controllers/deploye/deploye.controller.js";

export const deployRoute = express.Router();


deployRoute.post("/deploy", deployeController);
