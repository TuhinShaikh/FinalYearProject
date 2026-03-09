import { useEffect, useRef, useState } from "react";

const quickPrompts = [
  "How do I plan a TfL journey?",
  "What is the live status?",
  "Where do I book parking?",
];

const knowledgeBase = [
  {
    keywords: ["plan", "journey", "train", "tfl"],
    response:
      "Use the TfL journey planner block on this page. Enter your origin and destination, then tap Plan journey—if TfL returns multiple choices, pick one of the suggestions I surface and try again.",
  },
  {
    keywords: ["status", "live"],
    response:
      "Head over to the Status dashboard via the main nav—there is a live TfL tube map, Greater Anglia departures, and Uber surge pricing that you can open while you wait for a train.",
  },
  {
    keywords: ["parking", "book", "slots", "reserve"],
    response:
      "The Book Parking page is linked from the Home dashboard nav. It shows slot availability and handles checkout in one flow, so you can secure a space before you travel.",
  },
  {
    keywords: ["recommend", "ideas", "accessibility"],
    response:
      "The recommendations card on the Transport page refreshes TfL's accessibility-aware suggestions—hit the Refresh button to pull the latest data.",
  },
];

const fallbackResponse =
  "I can point you to the Transport planner, Status dashboard, or Parking booking screens—just ask for the part you need.";

const greetingTriggers = ["hi", "hello", "hey", "good morning", "good evening", "howdy"];
const appreciationTriggers = ["thanks", "thank you", "ta", "cheers"];

function isTriggered(message, triggers) {
  return triggers.some((token) => message.includes(token));
}

function generateAssistantResponse(message) {
  const normalized = message?.toLowerCase() ?? "";
  if (isTriggered(normalized, greetingTriggers)) {
    return "Hey! I'm the Travel Copilot—you can ask for journey planning, live status, or parking tips and I will help you find the right page.";
  }
  if (isTriggered(normalized, appreciationTriggers)) {
    return "Happy to help! Whenever you're ready, just send another question.";
  }
  const match = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.response : fallbackResponse;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { id: "welcome", sender: "bot", text: "Hi! I can help you plan journeys, check status, or book parking." },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    const userMessage = { id: `${Date.now()}-user`, sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setLoading(true);

    const assistantMessage = await new Promise((resolve) =>
      setTimeout(() => resolve(generateAssistantResponse(trimmed)), 450)
    );

    setMessages((prev) => [...prev, { id: `${Date.now()}-bot`, sender: "bot", text: assistantMessage }]);
    setLoading(false);
  };

  const handleQuick = (prompt) => sendMessage(prompt);

  const handleSend = () => sendMessage(draft);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-widget" aria-live="polite">
      <header className="chat-widget__header">
        <strong>Travel Copilot</strong>
        <button
          className="chat-widget__close"
          aria-label="Toggle helper"
          onClick={() => setDisclaimerVisible((prev) => !prev)}
        >
          {disclaimerVisible ? "Hide" : "Show"}
        </button>
      </header>

      {disclaimerVisible && (
        <p className="chat-widget__disclaimer">
          This assistant works entirely on your device and references the same TfL planner you already use on this page.
        </p>
      )}

      <div className="chat-widget__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-widget__message ${message.sender === "bot" ? "chat-widget__message--bot" : ""}`}
          >
            <span>{message.text}</span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="chat-widget__quick">
        {quickPrompts.map((prompt) => (
          <button key={prompt} onClick={() => handleQuick(prompt)} type="button">
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-widget__input-area">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask how to plan, check status, or spot a train"
          rows={1}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Typing…" : "Send"}
        </button>
      </div>
    </div>
  );
}
