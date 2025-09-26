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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setModel(""); // Reset model when provider changes
    // eslint-disable-next-line
    fetchModels();
  }, [provider]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark transition-colors duration-300">      
      <header className="p-4 sm:p-6">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined h-8 w-8 text-primary text-3xl">
                hardware
              </span>
              <span className="text-xl font-bold">The Builder</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Community</a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Enterprise</a>
              <a className="flex items-center text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">
                Resources <span className="material-icons text-lg">expand_more</span>
              </a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Careers</a>
              <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Pricing</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" onClick={toggleDarkMode} style={{cursor: 'pointer'}}><span className="material-icons">hub</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#"><span className="material-icons">code</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Sign in</a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">Get started</button>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="glow-background"></div>
        <div className="relative z-10 w-full max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-text-light dark:text-text-dark leading-tight">What should we build today?</h1>
          <p className="mt-4 text-lg md:text-xl text-subtle-light dark:text-subtle-dark max-w-2xl mx-auto">Create stunning apps & websites by chatting with AI.</p>
          <div className="mt-12 w-full mx-auto">
            <div className="relative">
              <textarea
                className="w-full bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark border border-border-light dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none text-lg p-6 pb-20 pr-20"
                placeholder="Type your idea and we'll build it together."
                rows="8"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-subtle-light dark:text-subtle-dark" htmlFor="provider-select">Provider:</label>
                  <div className="relative">
                    <div className="w-[180px]">
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
                        maxMenuHeight={5 * 28}
                        classNamePrefix="react-select"
                        isSearchable={false}
                        styles={undefined}
                        theme={undefined}
                      />
                      <span className="material-icons absolute left-1.5 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark text-xs">dns</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-subtle-light dark:text-subtle-dark" htmlFor="model-select">Model:</label>
                  <div className="relative">
                    <div className="w-[550px]">
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
                        maxMenuHeight={5 * 28}
                        classNamePrefix="react-select"
                        isSearchable={false}
                        styles={undefined}
                        theme={undefined}
                      />
                      <span className="material-icons absolute left-1.5 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark text-xs">memory</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="absolute right-4 top-4 h-12 w-12 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-[0_0_20px_theme(colors.primary/30%)] dark:shadow-[0_0_20px_theme(colors.primary/50%)]"
                onClick={runAgent}
                disabled={loading}
              >
                <span className="material-icons">arrow_upward</span>
              </button>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-subtle-light dark:text-subtle-dark">
            <div className="flex items-center space-x-2 p-2 bg-surface-light/30 dark:bg-surface-dark/30 backdrop-blur-sm border border-border-light/50 dark:border-gray-700/30 rounded-full">
              <button className="px-4 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">Prompt</button>
              <button className="px-4 py-1 rounded-full text-sm font-medium text-subtle-light dark:text-subtle-dark hover:bg-gray-200/50 dark:hover:bg-gray-700/50">Image</button>
              <button className="px-4 py-1 rounded-full text-sm font-medium text-subtle-light dark:text-subtle-dark hover:bg-gray-200/50 dark:hover:bg-gray-700/50">Video</button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors">
                <span className="material-icons text-xl">add</span>
                <span>Attach files</span>
              </button>
            </div>
          </div>
          {output && (
            <div className="mt-4 w-full max-w-2xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 text-center">Generated Project</h2>
                <FileViewer files={output.context} />
              </div>
            </div>
          )}
          {previewUrl && (
            <div className="mt-4 w-full max-w-2xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-2 text-center">Live Preview</h2>
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
