import express from 'express';
import { sendMessage } from '../controller/message.controller.js';
import { getMessage } from '../controller/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';
//If we're exporting protectRoute as the default export from protectRoute.js, you should import it without curly braces {}

const router = express.Router();
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessage);

export default router;