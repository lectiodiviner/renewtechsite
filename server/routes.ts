import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQnaSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // QNA Routes
  
  // Submit a new question
  app.post("/api/qna", async (req, res) => {
    try {
      const validatedData = insertQnaSubmissionSchema.parse(req.body);
      const submission = await storage.createQnaSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all QNA submissions
  app.get("/api/qna", async (req, res) => {
    try {
      const submissions = await storage.getQnaSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Answer a specific question (admin feature)
  app.put("/api/qna/:id/answer", async (req, res) => {
    try {
      const { id } = req.params;
      const { answer } = req.body;
      
      if (!answer || typeof answer !== 'string') {
        return res.status(400).json({ error: "Answer is required" });
      }

      const updatedSubmission = await storage.answerQnaSubmission(id, answer);
      
      if (!updatedSubmission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
