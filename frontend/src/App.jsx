import { useState, useEffect } from "react";
import FileViewer from "./components/FileViewer";
import Preview from "./components/Preview";

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
    fetchModels();
  }, [provider]);

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
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#"><span className="material-icons">hub</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#"><span className="material-icons">code</span></a>
            <a className="text-subtle-light dark:text-subtle-dark hover:text-text-light dark:hover:text-text-dark transition-colors" href="#">Sign in</a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">Get started</button>
          </div>
        </nav>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="arc-background">
          <div className="arc bg-surface-light dark:bg-surface-dark"></div>
        </div>
        <div className="gradient-background absolute inset-0 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-text-light dark:text-text-dark leading-tight">What should we build today?</h1>
          <p className="mt-4 text-lg md:text-xl text-subtle-light dark:text-subtle-dark max-w-2xl mx-auto">Create stunning apps & websites by chatting with AI.</p>
          <div className="mt-12 w-full max-w-2xl mx-auto">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <textarea 
                className="w-full bg-transparent text-text-light dark:text-text-dark placeholder-subtle-light dark:placeholder-subtle-dark border-none focus:ring-0 resize-none" 
                placeholder="Type your idea and we'll build it together." 
                rows="4"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <div className="flex justify-between items-end mt-2">
                <button className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-subtle-light dark:text-subtle-dark rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" onClick={runAgent} disabled={loading}>
                  <span className="material-icons">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-subtle-light dark:text-subtle-dark">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-subtle-light dark:text-subtle-dark" htmlFor="provider-select">Provider:</label>
                <div className="relative">
                  <select 
                    className="pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-text-light dark:text-text-dark" 
                    id="provider-select"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value="openrouter">OpenRouter</option>
                    <option value="kilocode">Kilo Code</option>
                  </select>
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">dns</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-subtle-light dark:text-subtle-dark" htmlFor="model-select">Model:</label>
                <div className="relative">
                  <select 
                    className="pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary text-text-light dark:text-text-dark" 
                    id="model-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    disabled={modelsLoading || availableModels.length === 0}
                  >
                    {modelsLoading ? (
                      <option>Loading free models...</option>
                    ) : availableModels.length === 0 ? (
                      <option>No free models available</option>
                    ) : (
                      availableModels.map((modelId) => (
                        <option key={modelId} value={modelId}>
                          {modelId}
                        </option>
                      ))
                    )}
                  </select>
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">memory</span>
                </div>
              </div>
            </div>
          </div>
          {output && (
            <div className="mt-8 w-full max-w-4xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4 text-center">Generated Project</h2>
                <FileViewer files={output.context} />
              </div>
            </div>
          )}
          {previewUrl && (
            <div className="mt-8 w-full max-w-4xl mx-auto">
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4 text-center">Live Preview</h2>
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
