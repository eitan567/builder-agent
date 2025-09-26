import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { agentLoop } from "./agent.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve generated files
app.use("/generated", express.static("./generated"));

// API to get free models for a provider
app.get("/api/models", async (req, res) => {
  const { provider } = req.query;
  
  try {
    let models = [];
    
    if (provider === "openrouter") {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      
      // Filter for models ending with ":free"
      models = data.data
        .filter(model => model.id.endsWith(":free"))
        .map(model => ({
          id: model.id,
          name: model.name || model.id,
          codingCapability: getCodingCapabilityScore(model.id) // Custom scoring
        }))
        .sort((a, b) => b.codingCapability - a.codingCapability)
        .map(model => model.id); // Return just IDs for dropdown
    } else if (provider === "kilocode") {
      // Placeholder for Kilo Code - implement based on their API
      // For now, return some free models ending with ":free"
      models = [
        "kilocode/grok-4-fast-free",
        "kilocode/code-supernova-free"
      ].sort((a, b) => getCodingCapabilityScore(b) - getCodingCapabilityScore(a));
    } else {
      return res.status(400).json({ error: "Unsupported provider" });
    }
    
    res.json({ models });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to score coding capability (1-10 scale)
function getCodingCapabilityScore(modelId) {
  const codingScores = {
    // High coding capability models
    "meta-llama/llama-3-70b-instruct": 10,
    "mistralai/mixtral-8x7b-instruct": 9,
    "meta-llama/llama-3-8b-instruct": 8,
    "google/gemini-pro-1.5": 8,
    "mistralai/mistral-7b-instruct": 7,
    "google/gemini-flash-1.5": 6,
    // Add more as needed
    "kilocode/grok-4-fast-free": 9,
    "kilocode/code-supernova-free": 8
  };
  return codingScores[modelId] || 5; // Default score
}

// API להרצת Agent
app.post("/api/run-agent", async (req, res) => {
  const { goal, model, provider } = req.body;
  try {
    const result = await agentLoop(goal, model, provider);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));