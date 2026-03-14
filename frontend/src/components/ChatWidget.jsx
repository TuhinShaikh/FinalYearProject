import { useEffect, useRef, useState } from "react";

const quickPrompts = [
  "How do I plan a TfL journey?",
  "What is the live status?",
  "Where do I book parking?",
];

const travelcardSummary =
  "Adult Travelcard prices (frozen until 2027) are £16.60 for Day Anytime/Off-peak across zones 1-4, £23.60 for zones 1-5, and £23.60 for zones 1-6; weekly/Monthly/Annual tiers run from £44.70/£171.70/£1,788 up to £81.60/£313.40/£3,264 as you add more zones.";

const paygCapsSummary =
  "Pay-as-you-go caps are frozen until 2027 too: Zones 1 or 1-2 stay at £8.90 per day (Monday-Sunday £44.70), Zone 1-3 is £10.50 (£52.50 week), Zone 1-4 is £12.80 (£64.20), Zone 1-5 is £15.30 (£76.40), Zone 1-6 is £16.30 (£81.60).";

const riverBusSummary =
  "Uber Boats by Thames Clippers charges £9.90 (Central), £6.20 (East/West), £11.40 for Central+East/West, and £19.30 for West to East fares with Travelcard discounts of around £0.30–£3.60; children travel roughly half price.";

const knowledgeBase = [
  {
    keywords: ["plan", "journey", "train", "tfl"],
    response:
      "Use the TfL journey planner block on this page. Enter your origin and destination, then tap Plan journey—if TfL returns multiple choices, pick one of the suggestions I surface and try again.",
  },
  {
    keywords: ["status", "live"],
    response:
      "Head over to the Status dashboard via the main nav—there is a live TfL tube map plus a Tottenham stadium showcase so you can plan the journey with the stadium in view.",
  },
  {
    keywords: ["parking", "book", "slots", "reserve"],
    response:
      "The Book Parking page is linked from the Home dashboard nav. It shows slot availability and handles checkout in one flow, so you can secure a space before you travel.",
  },
  {
    keywords: ["recommend", "ideas", "accessibility"],
    response:
      "Use the TfL journey planner on the Transport page—enter an origin and destination, tap Plan journey, and I will keep you updated on accessible options.",
  },
  {
    keywords: ["travelcard", "travel cards", "season ticket"],
    response: travelcardSummary,
  },
  {
    keywords: ["pay as you go", "caps", "daily cap"],
    response: paygCapsSummary,
  },
  {
    keywords: ["river bus", "uber boat", "thames clippers"],
    response: riverBusSummary,
  },
  {
    keywords: ["weather", "rain", "forecast"],
    response: "Rain is expected across London today; bring a waterproof layer so you can still hit the TfL planner or parking apps dry-shod.",
  },
];

const fallbackResponse =
  "I can point you to the Transport planner, Status dashboard, or Parking booking screens—just ask for the part you need.";

const greetingTriggers = ["hi", "hello", "hey", "good morning", "good evening", "howdy"];
const appreciationTriggers = ["thanks", "thank you", "ta", "cheers"];
const capabilityPattern = /what can (you|u) do/;
const namePattern = /do (i|you) need (my )?name/;
const travelIntentPattern = /([\w\s]+?)\s+to\s+([\w\s]+)/;
const zoneQueryPattern = /zone\s*((?:\d+\s*(?:and|-|to)?\s*)+)/;

const zoneCapsMap = {
  "1": { daily: "£8.90", offpeak: "£8.90", weekly: "£44.70" },
  "1-2": { daily: "£8.90", offpeak: "£8.90", weekly: "£44.70" },
  "1-3": { daily: "£10.50", offpeak: "£10.50", weekly: "£52.50" },
  "1-4": { daily: "£12.80", offpeak: "£12.80", weekly: "£64.20" },
  "1-5": { daily: "£15.30", offpeak: "£15.30", weekly: "£76.40" },
  "1-6": { daily: "£16.30", offpeak: "£16.30", weekly: "£81.60" },
};

const travelcardZonesMap = {
  "1": { day: "£16.60", weekly: "£44.70", monthly: "£171.70", annual: "£1,788" },
  "1-2": { day: "£16.60", weekly: "£44.70", monthly: "£171.70", annual: "£1,788" },
  "1-3": { day: "£16.60", weekly: "£44.70", monthly: "£201.60", annual: "£2,100" },
  "1-4": { day: "£16.60", weekly: "£44.70", monthly: "£246.60", annual: "£2,568" },
  "1-5": { day: "£23.60", weekly: "£76.40", monthly: "£293.40", annual: "£3,056" },
  "1-6": { day: "£23.60", weekly: "£81.60", monthly: "£313.40", annual: "£3,264" },
};

function formatZoneLabel(digits) {
  const unique = [...new Set(digits.map(Number))].sort((a, b) => a - b);
  if (unique.length === 1) return `Zone ${unique[0]}`;
  return `Zones ${unique[0]}–${unique[unique.length - 1]}`;
}

function describeZonePricing(zoneKey, zoneLabel) {
  const cap = zoneCapsMap[zoneKey];
  const card = travelcardZonesMap[zoneKey];
  if (!cap && !card) return null;
  const parts = [];
  if (cap) {
    parts.push(`${zoneLabel} pay-as-you-go daily cap ${cap.daily} (off-peak ${cap.offpeak}, weekly ${cap.weekly}).`);
  }
  if (card) {
    parts.push(`Travelcard day ${card.day}, weekly ${card.weekly}, monthly ${card.monthly}, annual ${card.annual}.`);
  }
  return parts.join(" ");
}

function buildZoneKey(digits) {
  const unique = [...new Set(digits.map(Number))].sort((a, b) => a - b);
  if (unique.length === 1) return `${unique[0]}`;
  return `${unique[0]}-${unique[unique.length - 1]}`;
}

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
  if (capabilityPattern.test(normalized)) {
    return "I can walk you to the Transport planner, the live Status dashboard, or the booking flow—tell me what you need first and I will link you to it.";
  }
  if (namePattern.test(normalized)) {
    return "No name needed—just say what you are trying to do (journey, status, parking) and I'll point you toward the relevant screen.";
  }
  const zoneMatch = normalized.match(zoneQueryPattern);
  if (zoneMatch) {
    const digits = zoneMatch[1].match(/\d+/g);
    if (digits) {
      const zoneKey = buildZoneKey(digits);
      const zoneLabel = formatZoneLabel(digits);
      const zoneResponse = describeZonePricing(zoneKey, zoneLabel);
      if (zoneResponse) return zoneResponse;
    }
  }
  if (travelIntentPattern.test(normalized)) {
    const [, origin, destination] = normalized.match(travelIntentPattern);
    return `Got it—journeys from ${origin.trim()} to ${destination.trim()} are best planned inside the TfL journey planner block on this page. Enter those places and tap Plan journey so I can surface more tips.`;
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
