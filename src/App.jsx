import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignUp } from "@clerk/clerk-react";
import Analyzer from "./Analyzer";   // Analyzer page
import Home from "./home";           // Homepage
import Login from "./login";         // Login page
import Navbar from "./navbar";       // Navbar
import FileUploader from "./fileuploader"; // FileUploader component

function App() {
  return (
    <div>
      {/* Navbar always visible */}
      <Navbar />

      {/* Add margin so content never hides behind navbar */}
      <div className="page-content">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <Home />
                </SignedOut>
                <SignedIn>
                  <Analyzer /> {/* Dashboard/Home for signed-in users */}
                </SignedIn>
              </>
            }
          />

          {/* Analyzer - Protected */}
          <Route
            path="/analyzer"
            element={
              <>
                <SignedIn>
                  <Analyzer />
                </SignedIn>
                <SignedOut>
                  <Login /> {/* Redirects to Clerk SignIn */}
                </SignedOut>
              </>
            }
          />

          {/* File Upload Page */}
          <Route path="/fileuploader" element={<FileUploader />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />

          {/* Signup Page with gradient */}
          <Route
            path="/signup"
            element={
              <div className="hero-container">
                <div className="hero-card">
                  <SignUp routing="path" path="/signup" redirectUrl="/analyzer" />
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
