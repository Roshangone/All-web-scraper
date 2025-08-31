import React, { useState, useEffect, useMemo } from "react";

const Results = ({ results, loading, error }) => {
  const [showLinks, setShowLinks] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const processedResults = useMemo(() => {
    if (!results) return null;
    if (typeof results === "string") return { raw: results };
    if (typeof results === "object") return results;
    return { raw: String(results) };
  }, [results]);

  const links = useMemo(() => {
    if (!processedResults) return [];
    if (processedResults.data?.links && Array.isArray(processedResults.data.links)) {
      return processedResults.data.links;
    }
    return [];
  }, [processedResults]);

  useEffect(() => {
    if (results) {
      setShowLinks(false);
      setShowJson(false);
    }
  }, [results]);

  function downloadLinks() {
    if (!links.length) return;
    const blob = new Blob([links.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${processedResults.domain || "links"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl shadow">
        <p className="text-blue-600 font-semibold">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-xl shadow">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!processedResults) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl shadow">
        <p className="text-gray-500 italic">No results yet. Run a scrape first.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Scrape Results</h2>
        <div className="flex gap-2">
          {links.length > 0 && (
            <>
              <button
                onClick={() => setShowLinks((prev) => !prev)}
                className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
              >
                {showLinks ? "Hide Links" : "Show Links"}
              </button>
              <button
                onClick={downloadLinks}
                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
              >
                Download Text File
              </button>
            </>
          )}
          <button
            onClick={() => setShowJson((prev) => !prev)}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            {showJson ? "Hide JSON" : "Show JSON"}
          </button>
        </div>
      </div>

      {/* Render links list */}
      {showLinks && links.length > 0 && (
        <div className="p-3 bg-gray-100 rounded-lg max-h-64 overflow-auto">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {links.map((link, idx) => (
              <li key={idx}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render JSON */}
      {showJson && (
        <div className="p-3 bg-gray-900 text-green-400 text-xs rounded-lg max-h-80 overflow-auto">
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Results;