import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import ChatWidget from "../components/ChatWidget";

// I keep this help page separate so guidance, shortcuts, and chat context stay focused.

const promptHighlights = [
  {
    title: "Plan a journey",
    description:
      "Give me your start, destination, and travel window and I will mirror the TfL planner that lives inside this experience.",
  },
  {
    title: "Live status",
    description:
      "Ask how lines, buses, or trains are behaving right now and I will point you toward the Status dashboard for the freshest data.",
  },
  {
    title: "Book parking",
    description:
      "Tell me when you need a slot and I will remind you which parking bay to grab and how to finish checkout.",
  },
];

const shortcutLinks = [
  { label: "Home dashboard", to: "/home" },
  { label: "Transport recommendations", to: "/transport" },
  { label: "Reserve parking", to: "/booking" },
  { label: "Live TfL status", to: "/status" },
];

export default function ChatbotPage() {
  return (
    <main className="chat-page">
      <section className="chat-page__panel">
        <header className="chat-page__header">
          <h1>Travel Helper</h1>
          <p className="chat-page__intro">
            This helper references the same TfL data and planner as the rest of the app-just type your question
            about journeys, status, or parking and I will surface the next best page.
          </p>
        </header>

        <div className="chat-page__grid">
          <div className="chat-page__assistant">
            <ChatWidget />
          </div>

          <aside className="chat-page__aside">
            <div className="chat-page__aside-card">
              <h2>Prompt starters</h2>
              <ul className="chat-page__aside-list">
                {promptHighlights.map((highlight) => (
                  <li key={highlight.title}>
                    <strong>{highlight.title}</strong>
                    <span>{highlight.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="chat-page__aside-card">
              <h2>Need a page?</h2>
              <p className="chat-page__aside-note">
                Use a shortcut to jump straight to the matching dashboard for real-time maps, parking, or bookings.
              </p>
              <nav className="chat-page__aside-links" aria-label="Quick navigation">
                {shortcutLinks.map((link) => (
                  // I keep page shortcuts near chat so users can act on guidance instantly.
                  <Link key={link.label} to={link.to} className="chat-page__aside-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
