## Social Media Content Analyzer

The **Social Media Content Analyzer** is a React-based web application designed to help users evaluate and enhance their content before publishing on social platforms. It integrates multiple technologies to provide intelligent insights and actionable suggestions.

Built with **React**, the project delivers a modern, responsive interface, while **Clerk** handles secure authentication and user management. Users can upload content seamlessly using the **drag-and-drop feature** or traditional file upload, making the experience quick and intuitive.

The application supports multiple file types. For **image files**, it leverages **Tesseract.js (OCR)** to extract embedded text. For **PDF documents**, it parses and retrieves textual content automatically. This flexibility ensures that users can analyze diverse content formats without additional effort.

Once the text is extracted, the system performs **sentiment analysis** to identify the overall tone (positive, negative, or neutral). It also provides **personalized suggestions** to improve readability, engagement, and effectiveness of the content, aligned with social media best practices.

By combining OCR, PDF parsing, sentiment detection, and contextual recommendations, this tool empowers users to create impactful posts that resonate with audiences and strengthen their online presence.

---

### 🚀 Features

* 🔑 Secure user authentication with **Clerk**
* 📂 **Drag-and-drop file upload** for convenience
* 🖼️ **OCR with Tesseract.js** to extract text from images
* 📑 **PDF parsing** to read and analyze documents
* 😊 **Sentiment analysis** (positive / negative / neutral tone)
* 💡 **Content improvement suggestions** for better engagement
* 📊 Clear and actionable analysis reports

---

### 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS
* **Authentication:** Clerk
* **OCR:** Tesseract.js
* **File Parsing:** PDF.js / custom parsing utilities
* **Analysis:** Natural Language Processing (sentiment + suggestions)
* **Other Tools:** Vite, Node.js environment

