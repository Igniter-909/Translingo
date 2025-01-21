import {Router} from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addMemberToChannel, createChannel, deleteChannel, getAllChannels, getChannelDetails, getChannelMessages, removeMemberFromChannel } from "../controllers/channel.controller.js";

const router = Router();

router.route("/createChannel").post(verifyJWT,createChannel);
router.route("/getUserChannel").get(verifyJWT, getAllChannels);
router.route("/getChannelMessages/:channelId").get(verifyJWT, getChannelMessages);
router.route("/deleteChannel/:channelId").delete(verifyJWT,deleteChannel);
router.route("/getChannelDetails/:channelId").get(verifyJWT,getChannelDetails);
router.route("/addMemberToChannel/:channelId").post(verifyJWT,addMemberToChannel);
router.route("/removeMemberFromChannel/:channelId").post(verifyJWT,removeMemberFromChannel);

export default router;