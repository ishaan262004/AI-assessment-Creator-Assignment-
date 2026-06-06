import type { Request, Response } from "express";

import { getRedisClient } from "../lib/redis";
import { Assignment } from "../models/assignment";
import { generationQueue } from "../queues/generation-queue";

export async function createAssignment(req: Request, res: Response) {
   try {
      const { dueDate, additionalInfo } = req.body;

      // Parse questionTypes from form data (sent as JSON string)
      let questionTypes;
      try {
         questionTypes =
            typeof req.body.questionTypes === "string"
               ? JSON.parse(req.body.questionTypes)
               : req.body.questionTypes;
      } catch {
         res.status(400).json({ error: "Invalid questionTypes format" });
         return;
      }

      // Convert uploaded files to base64 for storage
      const files = (req.files as Express.Multer.File[]) || [];
      const fileNames = files.map((f) => f.originalname);
      const fileData = files.map((f) => ({
         name: f.originalname,
         mimeType: f.mimetype,
         data: f.buffer.toString("base64"),
      }));

      // Validation
      if (!questionTypes || questionTypes.length === 0) {
         res.status(400).json({
            error: "At least one question type is required",
         });
         return;
      }

      for (const qt of questionTypes) {
         if (!qt.type || qt.numberOfQuestions < 1 || qt.marks < 1) {
            res.status(400).json({
               error: "Invalid question type: type, numberOfQuestions, and marks are required",
            });
            return;
         }
      }

      // Create assignment
      const assignment = await Assignment.create({
         dueDate,
         questionTypes,
         additionalInfo: additionalInfo || "",
         fileNames,
         fileData,
         status: "pending",
      });

      // Add job to queue with retry
      await generationQueue.add(
         "generate",
         { assignmentId: assignment._id.toString() },
         { attempts: 3, backoff: { type: "exponential", delay: 3000 } },
      );

      res.status(201).json({
         id: assignment._id,
         status: assignment.status,
         message: "Assignment created. Generation started.",
      });
   } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ error: "Failed to create assignment" });
   }
}

export async function getAssignment(req: Request, res: Response) {
   try {
      const { id } = req.params;

      // Check Redis cache first
      const cached = await getRedisClient().get(`assignment:${id}`);
      if (cached) {
         res.json(JSON.parse(cached));
         return;
      }

      const assignment = await Assignment.findById(id).select("-fileData");
      if (!assignment) {
         res.status(404).json({ error: "Assignment not found" });
         return;
      }

      // Cache completed assignments
      if (assignment.status === "completed") {
         await getRedisClient().set(
            `assignment:${id}`,
            JSON.stringify(assignment),
            { EX: 3600 },
         );
      }

      res.json(assignment);
   } catch (error) {
      console.error("Get assignment error:", error);
      res.status(500).json({ error: "Failed to fetch assignment" });
   }
}

export async function listAssignments(_req: Request, res: Response) {
   try {
      const assignments = await Assignment.find()
         .select("-generatedPaper -fileData")
         .sort({ createdAt: -1 });

      res.json(assignments);
   } catch (error) {
      console.error("List assignments error:", error);
      res.status(500).json({ error: "Failed to list assignments" });
   }
}
