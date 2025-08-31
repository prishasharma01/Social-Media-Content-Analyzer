import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          Social Media Content Analyser
        </Link>
      </div>

      <div className="navbar-right">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link to="/login" className="nav-button">🔑 Login</Link>
        </SignedOut>
      </div>
    </nav>
  );
}
