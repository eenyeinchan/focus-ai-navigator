import { Router, type IRouter } from "express";
import healthRouter from "./health";
import notesRouter from "./notes";
import tasksRouter from "./tasks";
import focusRouter from "./focus";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(notesRouter);
router.use(tasksRouter);
router.use(focusRouter);
router.use(dashboardRouter);

export default router;
