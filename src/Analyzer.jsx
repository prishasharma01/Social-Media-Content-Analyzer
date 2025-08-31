import { useState, useRef } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import Tesseract from "tesseract.js";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "./App.css";

GlobalWorkerOptions.workerSrc = pdfWorker;

function Analyzer() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  //PDF text extraction
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      extractedText += content.items.map((s) => s.str).join(" ") + "\n\n";
    }
    return extractedText;
  };

  // OCR for images
  const extractTextFromImage = async (file) => {
    const result = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });
    return result.data.text;
  };

  // Text Analysis + Suggestions
  const analyzeText = (rawText) => {
    if (!rawText) return null;
    const words = rawText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    // Word frequency
    const freq = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Hashtags + Mentions
    const hashtags = rawText.match(/#[\w]+/g) || [];
    const mentions = rawText.match(/@[\w]+/g) || [];

    // Sentiment scoring
    const positiveWords = ["good", "great", "amazing", "love", "happy", "awesome"];
    const negativeWords = ["bad", "sad", "hate", "angry", "terrible", "worst"];

    let score = 0;
    words.forEach((w) => {
      if (positiveWords.includes(w)) score++;
      if (negativeWords.includes(w)) score--;
    });

    let sentiment = "Neutral";
    let sentimentValue = 50;
    if (score > 0) {
      sentiment = "Positive";
      sentimentValue = Math.min(100, 50 + score * 10);
    }
    if (score < 0) {
      sentiment = "Negative";
      sentimentValue = Math.max(0, 50 + score * 10);
    }

    // Suggestions
    const suggestions = [];
    if (wordCount > 200) suggestions.push(" Try shortening the post for better readability.");
    if (wordCount < 20) suggestions.push(" Add more context to make the post informative.");
    if (hashtags.length === 0) suggestions.push(" Add some hashtags to increase reach.");
    if (mentions.length === 0) suggestions.push(" Mention relevant users to improve engagement.");
    if (sentiment === "Negative") suggestions.push(" Consider rephrasing negative words for a more positive tone.");
    if (sentiment === "Neutral") suggestions.push(" Add some expressive words to make the content more engaging.");
    if (rawText.split("\n").some((p) => p.length > 200)) {
      suggestions.push("Break large paragraphs into smaller chunks.");
    }
    if (!/[.!?]$/.test(rawText.trim())) {
      suggestions.push(" End your post with proper punctuation.");
    }
    const emojis = rawText.match(/\p{Emoji}/gu) || [];
    if (emojis.length === 0) {
      suggestions.push("Add 1-2 emojis to make the post friendlier.");
    } else if (emojis.length > 5) {
      suggestions.push("Too many emojis! Keep it minimal for professionalism.");
    }
    const hasCTA = /(join|follow|learn more|check out|sign up|visit)/i.test(rawText);
    if (!hasCTA) suggestions.push(" Add a clear call-to-action (e.g., 'Join us', 'Learn more').");
    if (/\si\s/.test(rawText)) {
      suggestions.push(" Capitalize 'I' when referring to yourself.");
    }
    if (suggestions.length === 0) {
      suggestions.push("Your content looks well-balanced!");
    }

    return { wordCount, topWords, hashtags, mentions, sentiment, sentimentValue, suggestions };
  };

  //  Process uploaded file
  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setProgress(0);
    setText("");
    setAnalysis(null);

    let extracted = "";
    try {
      if (file.type === "application/pdf") {
        extracted = await extractTextFromPDF(file);
      } else if (file.type.startsWith("image/")) {
        extracted = await extractTextFromImage(file);
      } else if (file.type === "text/plain") {
        extracted = await file.text();
      } else {
        extracted = "❌ Unsupported file type.";
      }
    } catch (err) {
      extracted = "❌ Extraction failed.";
      console.error(err);
    }

    setLoading(false);
    setProgress(0);
    setText(extracted);
    setAnalysis(analyzeText(extracted));
  };

  // Handlers
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    await processFile(e.dataTransfer.files[0]);
  };
  const handleClick = () => fileInputRef.current.click();

  return (
    <div className="container">
      <h1>Social Media Content Analyzer</h1>

      {/* Hidden Input for Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      
      {/* File Upload Button */}
<div className="upload-btn-wrapper">
  <button className="upload-btn" onClick={handleClick}>
    📂 Upload File
  </button>
</div>


      {/* Drag & Drop Zone */}
      <div
        className={`dropzone ${dragActive ? "active" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragActive
          ? "👉 Drop your file here!"
          : "📂 Click or Drag & Drop your file here"}
      </div>


      {fileName && (
        <p className="uploaded-file">
          📌 Uploaded File: <strong>{fileName}</strong>
        </p>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-section">
          <div className="spinner" />
          <p>
            {progress > 0
              ? `⏳ Extracting... ${progress}%`
              : "⏳ Extracting text..."}
          </p>
        </div>
      ) : (
        text && (
          <div className="results-container">
            {/* Left - Extracted Text */}
            <div className="left-section">
              <h2>📜 Extracted Text</h2>
              <div className="text-box">{text}</div>
            </div>

            {/* Right - Analysis */}
            {analysis && (
              <div className="right-section">
                <h2>📊 Analysis Results</h2>

                {/* Grid for small cards */}
                <div className="analysis-grid">
                  <div className="card">
                    <h3>📝 Word Count</h3>
                    <p>{analysis.wordCount}</p>
                  </div>
                  <div className="card">
                    <h3>🔝 Top Words</h3>
                    <ul>
                      {analysis.topWords.map(([w, c], i) => (
                        <li key={i}>
                          {w} ({c})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card">
                    <h3>🏷️ Hashtags</h3>
                    <p>
                      {analysis.hashtags.length
                        ? analysis.hashtags.join(", ")
                        : "None"}
                    </p>
                  </div>
                  <div className="card">
                    <h3>👥 Mentions</h3>
                    <p>
                      {analysis.mentions.length
                        ? analysis.mentions.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="card suggestions-card full-width">
                  <h3>💡 Suggestions</h3>
                  <ul>
                    {analysis.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Sentiment */}
                <div className="card sentiment-card full-width">
                  <h3>😊 Sentiment</h3>
                  <p>{analysis.sentiment}</p>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${analysis.sentimentValue}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default Analyzer;
