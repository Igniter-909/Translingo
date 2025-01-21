import {Router} from "express";
import { deleteAvatar, forgotPassword, getUserDetails, login, logout, signup, updateAvatar, updateDetails } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {upload}  from "../middlewares/multer.middleware.js"


const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/updateDetails").post(verifyJWT,updateDetails);
router.route("/updateAvatar").post(
    verifyJWT,
    upload.fields([{
        name: 'avatar',
        maxcount:1
    }]),
    updateAvatar);

router.route("/deleteAvatar").put(verifyJWT,deleteAvatar);
router.route("/getUserDetails").get(verifyJWT,getUserDetails);
router.route("/logout").post(verifyJWT,logout);
router.route("resetPassword").post(forgotPassword);

export default router;
