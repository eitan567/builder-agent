import fs from "fs";
import { exec } from "child_process";
import fetch from "node-fetch";

export async function callLLM(messages, tools, model, provider = "openrouter") {
  let url, headers, body;

  switch (provider) {
    case "openrouter":
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      };
      body = JSON.stringify({ model, messages, tools });
      break;
    case "kilocode":
      url = "https://api.kilocode.ai/api/v1/chat/completions"; // Assuming endpoint
      headers = {
        "Authorization": `Bearer ${process.env.KILOCODE_API_KEY}`,
        "Content-Type": "application/json"
      };
      body = JSON.stringify({ model, messages, tools });
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || `API error: ${res.status}`);
  }
  return await res.json();
}

// Tools
function writeFile(filename, content) {
  fs.writeFileSync(`./generated/${filename}`, content);
  return `✅ File written: ${filename}`;
}
function readFile(filename) {
  if (!fs.existsSync(`./generated/${filename}`)) return `❌ File not found`;
  return fs.readFileSync(`./generated/${filename}`, "utf8");
}
function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) resolve(`Error: ${error.message}`);
      else if (stderr) resolve(`Stderr: ${stderr}`);
      else resolve(stdout);
    });
  });
}

// Main agent loop
export async function agentLoop(goal, model = "google/gemini-flash-1.5", provider = "openrouter") {
  let context = [];
  const tools = [
    {
      type: "function",
      function: {
        name: "writeFile",
        description: "Write file",
        parameters: { type: "object", properties: { filename: { type: "string" }, content: { type: "string" } }, required: ["filename","content"] }
      }
    },
    {
      type: "function",
      function: {
        name: "readFile",
        description: "Read file",
        parameters: { type: "object", properties: { filename: { type: "string" } }, required: ["filename"] }
      }
    },
    {
      type: "function",
      function: {
        name: "runCommand",
        description: "Run shell command",
        parameters: { type: "object", properties: { command: { type: "string" } }, required: ["command"] }
      }
    }
  ];

  while (true) {
    const response = await callLLM(
      [
        { role: "system", content: "You are an AI agent that builds small web projects." },
        { role: "user", content: `Goal: ${goal}\nContext: ${JSON.stringify(context)}` }
      ],
      tools,
      model,
      provider
    );

    const message = response.choices[0].message;
    const toolCall = message.tool_calls?.[0];
    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      let result;
      if (toolCall.function.name === "writeFile") result = writeFile(args.filename, args.content);
      else if (toolCall.function.name === "readFile") result = readFile(args.filename);
      else if (toolCall.function.name === "runCommand") result = await runCommand(args.command);

      context.push({ tool: toolCall.function.name, input: args, output: result });
    } else {
      return { context, message: message.content };
    }
  }
}