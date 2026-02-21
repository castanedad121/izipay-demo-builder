import { Router } from "express";
import * as ctrl from "../controllers/payment.controller.js";

const r = Router();

r.post("/build-checkout", ctrl.buildCheckout);
r.post("/token-session", ctrl.tokenSession);

export default r;
