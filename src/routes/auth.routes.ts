import { Router } from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import deserializeUser from "../middleware/deserializeUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = Router();

router.post(
  "/",
  validateResource(createSessionSchema),
  createSessionHandler,
  deserializeUser
);

export default router;
