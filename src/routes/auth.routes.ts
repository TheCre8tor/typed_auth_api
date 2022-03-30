import { Router } from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import routeGuard from "../middleware/routeGuard";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = Router();

router.post("/", validateResource(createSessionSchema), createSessionHandler);

export default router;
