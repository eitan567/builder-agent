import { useState, useEffect } from "react";
import FileViewer from "./components/FileViewer";
import Preview from "./components/Preview";
import Select from "react-select";

import "./reactSelectOverrides.css";

function App() {
  const [goal, setGoal] = useState("");
  const [model, setModel] = useState("");
  const [provider, setProvider] = useState("openrouter");
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line
    fetchModels();
  }, [provider]);

  // eslint-disable-next-line
  async function fetchModels() {
    if (!provider) return;
    
    setModelsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/models?provider=${provider}`);
      const data = await res.json();
      setAvailableModels(data.models || []);
      
      if (data.models && data.models.length > 0 && !model) {
        setModel(data.models[0]);
      }
    } catch (err) {
      console.error("Failed to fetch models:", err);
      setAvailableModels([]);
    } finally {
      setModelsLoading(false);
    }
  }

  async function runAgent() {
    setLoading(true);
    setPreviewUrl(null);
    const res = await fetch("http://localhost:5000/api/run-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, model, provider })
    });
    const data = await res.json();
    setOutput(data);

    const hasIndex = data.context.find(
      (f) => f.input?.filename === "index.html"
    );
    if (hasIndex) {
      setPreviewUrl("http://localhost:5000/generated/index.html");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-2 sm:p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined h-5 w-5 text-primary text-xl">
                hardware
              </span>
              <span className="text-base font-bold">The Builder</span>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">Community</a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">Enterprise</a>
              <a className="flex items-center text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">
                Resources <span className="material-icons text-sm">expand_more</span>
              </a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">Careers</a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">Pricing</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#"><span className="material-icons">hub</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#"><span className="material-icons">code</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors text-sm" href="#">Sign in</a>
            <button className="bg-primary text-white px-2 py-1 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-xs">Get started</button>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="arc-background">
          <div className="arc bg-surface-light dark:bg-surface-dark"></div>
        </div>
        <div className="gradient-background absolute inset-0 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">What should we build today?</h1>
          <p className="mt-3 text-base md:text-lg text-subtle-light dark:text-subtle-dark max-w-xl mx-auto">Create stunning apps & websites by chatting with AI.</p>
          <div className="mt-8 w-full max-w-xl mx-auto">
            <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <textarea
                className="w-full bg-transparent text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark border-none focus:ring-0 resize-none text-sm"
                placeholder="Type your idea and we'll build it together."
                rows="3"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <div className="flex justify-between items-end mt-1">
                <button className="h-8 w-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-subtle-light dark:text-subtle-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={runAgent} disabled={loading}>
                  <span className="material-icons text-sm">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-subtle-light dark:text-subtle-dark">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-subtle-light dark:text-subtle-dark text-sm" htmlFor="provider-select">Provider:</label>
                <div className="relative">
                  <div className="w-[160px]">
                    <Select
                      id="provider-select"
                      isDisabled={false}
                      options={[
                        { value: "openrouter", label: "OpenRouter" },
                        { value: "kilocode", label: "Kilo Code" }
                      ]}
                      value={{ value: provider, label: provider === "openrouter" ? "OpenRouter" : "Kilo Code" }}
                      onChange={(option) => setProvider(option ? option.value : "")}
                      placeholder="Select provider..."
                      menuPlacement="auto"
                      menuPosition="fixed"
                      maxMenuHeight={5 * 32}
                      classNamePrefix="react-select"
                      isSearchable={false}
                      styles={undefined}
                      theme={undefined}
                    />
                    <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark text-sm">dns</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-subtle-light dark:text-subtle-dark text-sm" htmlFor="model-select">Model:</label>
                <div className="relative">
                  <div className="w-[240px]">
                    <Select
                      id="model-select"
                      isDisabled={modelsLoading || availableModels.length === 0}
                      isLoading={modelsLoading}
                      options={availableModels.map((modelId) => ({ value: modelId, label: modelId }))}
                      value={model ? { value: model, label: model } : null}
                      onChange={(option) => setModel(option ? option.value : "")}
                      placeholder={modelsLoading ? "Loading free models..." : availableModels.length === 0 ? "No free models available" : "Select model..."}
                      menuPlacement="auto"
                      menuPosition="fixed"
                      maxMenuHeight={5 * 32}
                      classNamePrefix="react-select"
                      isSearchable={false}
                      styles={undefined}
                      theme={undefined}
                    />
                    <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark text-sm">memory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {output && (
            <div className="mt-6 w-full max-w-3xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 text-center">Generated Project</h2>
                <FileViewer files={output.context} />
              </div>
            </div>
          )}
          {previewUrl && (
            <div className="mt-6 w-full max-w-3xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-3 text-center">Live Preview</h2>
                <Preview url={previewUrl} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
