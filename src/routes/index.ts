import { Router, Response, Request } from "express";
import routeGuard from "../middleware/routeGuard";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.use("/api/users", userRouter);
router.use("/api/sessions", authRouter);

export default router;
