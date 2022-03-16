import { Router, Response, Request } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

router.use(userRouter);
router.use(authRouter);

export default router;
