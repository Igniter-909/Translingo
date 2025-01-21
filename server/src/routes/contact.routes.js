import {Router} from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getAllContacts, getContactsFORDMLIST, searchContacts } from "../controllers/contact.controller.js";

const router = Router();

router.route("/search").post(verifyJWT,searchContacts);
router.route("/getContactsForDM").get(verifyJWT,getContactsFORDMLIST);
router.route("/getAllContacts").get(verifyJWT,getAllContacts);

export default router;