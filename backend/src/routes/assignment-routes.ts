import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import multer from "multer";
import path from "path";

import {
   createAssignment,
   getAssignment,
   listAssignments,
} from "../controllers/assignment-controller";

const router = Router();

const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
   fileFilter: (_req, file, cb) => {
      const allowed = [".jpeg", ".jpg", ".png", ".pdf"];
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, allowed.includes(ext));
   },
});

// Wrap multer to handle "Request aborted" errors gracefully
function handleUpload(req: Request, res: Response, next: NextFunction) {
   upload.array("files", 10)(req, res, (err) => {
      if (err) {
         if (err.message === "Request aborted") {
            console.warn("File upload aborted by client");
            return;
         }
         return res.status(400).json({ error: err.message });
      }
      next();
   });
}

router.post("/", handleUpload, createAssignment);
router.get("/", listAssignments);
router.get("/:id", getAssignment);

export default router;
