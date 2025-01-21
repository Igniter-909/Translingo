import {Router} from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getMessages, uploadFile } from "../controllers/chat.controller.js";
import {upload}  from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/getMessages").post(verifyJWT,getMessages);
router.route("/uploadFile").post(verifyJWT,
    upload.fields([{
        name: 'file',
        maxcount:1
    }])
    ,uploadFile)

export default router;