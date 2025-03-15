import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from a samples directory (if available)
  const samplesDir = path.join(__dirname, "..", "samples");
  if (fs.existsSync(samplesDir)) {
    app.use("/samples", express.static(samplesDir));
  }

  // API route to check if a media URL is reachable
  app.get("/api/check-media", async (req, res) => {
    const url = req.query.url as string;
    
    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }
    
    try {
      const response = await fetch(url, { method: "HEAD" });
      
      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const isAudio = contentType.includes("audio");
        const isVideo = contentType.includes("video");
        
        return res.json({
          success: true,
          contentType,
          isAudio,
          isVideo,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Media not found or not accessible",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to check media URL",
        error: (error as Error).message,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
