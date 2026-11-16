import { useEffect, useRef, useState } from "react";
import axios from "axios";

// I keep chat logic local to this component so prompts, fare helpers, and UI stay tightly coupled.

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
      "Open the Status dashboard from the main nav for live line updates and the London Overground + Stadium map.",
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
const travelIntentPattern = /^\s*([\w\s'.-]+?)\s+to\s+([\w\s'.-]+?)\s*$/;
const journeyFromToPattern = /from\s+([\w\s'.-]+?)\s+to\s+([\w\s'.-]+)/;
const journeyToFromPattern = /to\s+([\w\s'.-]+?)\s+from\s+([\w\s'.-]+)/;
const fareIntentPattern = /(how much|cost|fare|price|ticket)/;
const zoneQueryPattern = /zone\s*((?:\d+\s*(?:and|-|to)?\s*)+)/;
const stationZonePricePattern = /(zone|fare|price|cost|how much).*(station|from|to)|\b(station|zone|fare|price|cost)\b/;

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
  const pricingKey = getPricingZonePricingKey(zoneKey);
  const cap = zoneCapsMap[pricingKey];
  const card = travelcardZonesMap[pricingKey];
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

function getZoneDigits(zoneKey) {
  return [...new Set((`${zoneKey}`.match(/\d+/g) ?? []).map(Number))].sort((a, b) => a - b);
}

function getPricingZonePricingKey(zoneKey) {
  const digits = getZoneDigits(zoneKey);
  if (!digits.length) return null;
  const maxZone = Math.min(6, Math.max(...digits));
  if (maxZone <= 1) return "1";
  return `1-${maxZone}`;
}

function buildZoneKey(digits) {
  const unique = [...new Set(digits.map(Number))].sort((a, b) => a - b);
  if (unique.length === 1) return `${unique[0]}`;
  return `${unique[0]}-${unique[unique.length - 1]}`;
}

function isTriggered(message, triggers) {
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return triggers.some((token) => {
    const pattern = new RegExp(`(^|\\s|[.,!?;:])${escapeRegex(token)}($|\\s|[.,!?;:])`, "i");
    return pattern.test(message);
  });
}

function cleanPlaceName(raw) {
  if (!raw) return "";

  let value = raw
    .toLowerCase()
    .replace(/^[\s,.;:!?-]+|[\s,.;:!?-]+$/g, "")
    .replace(/^(to|go|go to|travel to|get to|head to)\s+/, "")
    .replace(/\s+(please|now|today|thanks|thank you)$/g, "")
    .trim();

  if (value === "white hart line") {
    value = "white hart lane";
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStationName(name) {
  return (name ?? "")
    .toLowerCase()
    .replace(/\b(underground|overground|rail|dlr|elizabeth line|station|london)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractZoneKeyFromStopPoint(stopPoint) {
  const directZone = stopPoint?.zone;
  if (directZone) {
    const nums = `${directZone}`.match(/\d+/g);
    if (nums?.length) {
      const unique = [...new Set(nums.map(Number))].sort((a, b) => a - b);
      return unique.length === 1 ? `${unique[0]}` : `${unique[0]}-${unique[unique.length - 1]}`;
    }
  }

  const props = stopPoint?.additionalProperties ?? [];
  for (const prop of props) {
    const key = `${prop?.key ?? ""}`.toLowerCase();
    if (key.includes("zone")) {
      const nums = `${prop?.value ?? ""}`.match(/\d+/g);
      if (nums?.length) {
        const unique = [...new Set(nums.map(Number))].sort((a, b) => a - b);
        return unique.length === 1 ? `${unique[0]}` : `${unique[0]}-${unique[unique.length - 1]}`;
      }
    }
  }

  return null;
}

function findStationInMessage(message, stationsIndex) {
  const normalizedMessage = normalizeStationName(message);
  if (!normalizedMessage) return null;

  const matches = stationsIndex.filter((station) => {
    if (!station.normalized || station.normalized.length < 3) return false;
    const paddedMessage = ` ${normalizedMessage} `;
    const paddedStation = ` ${station.normalized} `;
    return paddedMessage.includes(paddedStation);
  });

  if (!matches.length) return null;
  matches.sort((a, b) => b.normalized.length - a.normalized.length);
  return matches[0];
}

function findStationByName(name, stationsIndex) {
  const normalizedQuery = normalizeStationName(name);
  if (!normalizedQuery) return null;

  const exact = stationsIndex.find((station) => station.normalized === normalizedQuery);
  if (exact) return exact;

  const partial = stationsIndex
    .filter((station) => station.normalized.includes(normalizedQuery) || normalizedQuery.includes(station.normalized))
    .sort((a, b) => b.normalized.length - a.normalized.length);

  return partial[0] ?? null;
}

function formatZoneLabelFromKey(zoneKey) {
  return zoneKey.includes("-") ? `Zones ${zoneKey}` : `Zone ${zoneKey}`;
}

function extractJourneyPlaces(normalized) {
  const fromTo = normalized.match(journeyFromToPattern);
  if (fromTo) {
    return {
      origin: cleanPlaceName(fromTo[1]),
      destination: cleanPlaceName(fromTo[2]),
    };
  }

  const toFrom = normalized.match(journeyToFromPattern);
  if (toFrom) {
    return {
      origin: cleanPlaceName(toFrom[2]),
      destination: cleanPlaceName(toFrom[1]),
    };
  }

  const direct = normalized.match(travelIntentPattern);
  if (direct) {
    return {
      origin: cleanPlaceName(direct[1]),
      destination: cleanPlaceName(direct[2]),
    };
  }

  return null;
}

function generateTravelResponse(message, stationZones) {
  const normalized = message?.toLowerCase() ?? "";
  if (isTriggered(normalized, greetingTriggers)) {
    return "Hey! I'm the Travel Helper-you can ask for journey planning, live status, or parking tips and I will help you find the right page.";
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

  if (stationZonePricePattern.test(normalized) && stationZones.length > 0) {
    const stationMatch = findStationInMessage(normalized, stationZones);
    if (stationMatch) {
      const zoneLabel = formatZoneLabelFromKey(stationMatch.zoneKey);
      const pricing = describeZonePricing(stationMatch.zoneKey, zoneLabel);
      if (pricing) {
        const pricingKey = getPricingZonePricingKey(stationMatch.zoneKey);
        const mappedNote = pricingKey && pricingKey !== stationMatch.zoneKey
          ? ` Using ${formatZoneLabelFromKey(pricingKey)} fare bands for the current cap table.`
          : "";
        return `${stationMatch.displayName} is in ${zoneLabel}. ${pricing}${mappedNote}`;
      }
      return `${stationMatch.displayName} is in ${zoneLabel}.`;
    }
  }

  const route = extractJourneyPlaces(normalized);
  if (fareIntentPattern.test(normalized) && route) {
    const originStation = findStationByName(route.origin, stationZones);
    const destinationStation = findStationByName(route.destination, stationZones);
    if (originStation && destinationStation) {
      const mergedDigits = [...new Set([
        ...getZoneDigits(originStation.zoneKey),
        ...getZoneDigits(destinationStation.zoneKey),
      ])].sort((a, b) => a - b);
      const mergedZoneKey = mergedDigits.length === 1
        ? `${mergedDigits[0]}`
        : `${mergedDigits[0]}-${mergedDigits[mergedDigits.length - 1]}`;
      const mergedZoneLabel = formatZoneLabelFromKey(mergedZoneKey);
      const pricing = describeZonePricing(mergedZoneKey, mergedZoneLabel);
      if (pricing) {
        return `${originStation.displayName} (${formatZoneLabelFromKey(originStation.zoneKey)}) to ${destinationStation.displayName} (${formatZoneLabelFromKey(destinationStation.zoneKey)}): ${pricing}`;
      }
    }
    return `For fare details from ${route.origin} to ${route.destination}, open the Transport planner and run that route first. TfL will return the exact journey options, then you can compare caps or Travelcard prices.`;
  }
  if (route) {
    const { origin, destination } = route;
    return `Got it—journeys from ${origin.trim()} to ${destination.trim()} are best planned inside the TfL journey planner block on this page. Enter those places and tap Plan journey so I can surface more tips.`;
  }
  const match = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );
  return match ? match.response : fallbackResponse;
}

export default function ChatWidget() {
  // I keep a simple incrementing id so message keys stay stable without time-based randomness.
  const messageIdRef = useRef(0);
  const [messages, setMessages] = useState([
    { id: "welcome", sender: "bot", text: "Hi! I can help you plan journeys, check status, or book parking." },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);
  const [stationZones, setStationZones] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const modeEndpoints = [
      "tube",
      "overground",
      "dlr",
      "elizabeth-line",
    ];

    Promise.allSettled(
      modeEndpoints.map((mode) => axios.get(`https://api.tfl.gov.uk/StopPoint/Mode/${mode}`))
    ).then((results) => {
      if (!mounted) return;

      const byName = new Map();

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const payload = result.value?.data?.stopPoints ?? result.value?.data ?? [];
        if (!Array.isArray(payload)) return;

        payload.forEach((stopPoint) => {
          const displayName = `${stopPoint?.commonName ?? stopPoint?.name ?? ""}`.trim();
          const normalizedName = normalizeStationName(displayName);
          if (!displayName || !normalizedName) return;

          const zoneKey = extractZoneKeyFromStopPoint(stopPoint);
          if (!zoneKey) return;

          const existing = byName.get(normalizedName);
          if (!existing) {
            byName.set(normalizedName, {
              normalized: normalizedName,
              displayName,
              zoneKey,
            });
            return;
          }

          if (displayName.length > existing.displayName.length) {
            existing.displayName = displayName;
          }
          if (existing.zoneKey !== zoneKey) {
            const nums = [...new Set(`${existing.zoneKey}-${zoneKey}`.match(/\d+/g)?.map(Number) ?? [])].sort(
              (a, b) => a - b
            );
            if (nums.length === 1) {
              existing.zoneKey = `${nums[0]}`;
            } else if (nums.length > 1) {
              existing.zoneKey = `${nums[0]}-${nums[nums.length - 1]}`;
            }
          }
        });
      });

      setStationZones(Array.from(byName.values()));
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const nextMessageId = (sender) => {
    messageIdRef.current += 1;
    return `${sender}-${messageIdRef.current}`;
  };

  const sendMessage = async (text) => {
    // Main chat pipeline: append user message, get response, append bot output.
    const trimmed = text?.trim();
    if (!trimmed) return;

    const userMessage = { id: nextMessageId("user"), sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setLoading(true);

    const botMessage = await new Promise((resolve) =>
      setTimeout(() => resolve(generateTravelResponse(trimmed, stationZones)), 450)
    );

    setMessages((prev) => [...prev, { id: nextMessageId("bot"), sender: "bot", text: botMessage }]);
    setLoading(false);
  };

  const handleQuick = (prompt) => sendMessage(prompt);

  // Send button uses the same path as Enter key so behavior stays consistent.
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
        <strong>Travel Helper</strong>
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
          This helper works entirely on your device and references the same TfL planner you already use on this page.
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
          // Quick prompts reduce typing friction for first-time users.
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
