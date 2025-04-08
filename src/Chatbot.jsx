import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [step, setStep] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState({ name: "", phone: "" });
  const [menuStack, setMenuStack] = useState([]);

  const menus = {
    main: [
      { label: "📘 Course Info", next: "courses" },
      { label: "💸 Fee Structure", next: "fees" },
      { label: "🧾 Registration Help", next: "register" },
      {
        label: "❓ Didn't find what you're looking for? Call us",
        next: "call",
      },
    ],
    courses: [
      { label: "📘 CFA", next: "cfa" },
      { label: "📕 FRM", next: "frm" },
      { label: "📙 CA", next: "ca" },
      { label: "🔙 Back", next: "main" },
    ],
    cfa: [
      { label: "📗 Level 1", next: "cfaLevel1" },
      { label: "📘 Level 2", next: "cfaLevel2" },
      { label: "📙 Level 3", next: "cfaLevel3" },
      { label: "🔙 Back", next: "courses" },
    ],
    cfaLevel1: [
      { label: "📚 Syllabus", next: "cfaLevel1Syllabus" },
      { label: "🗓️ Exam Dates", next: "cfaLevel1Dates" },
      { label: "🧪 Mock Tests", next: "cfaLevel1Mocks" },
      { label: "🔙 Back", next: "cfa" },
    ],
    cfaLevel2: [
      { label: "📚 Topics Covered", next: "cfaLevel2Topics" },
      { label: "📝 Registration Info", next: "cfaLevel2Reg" },
      { label: "🔙 Back", next: "cfa" },
    ],
    cfaLevel3: [
      { label: "📘 Exam Pattern", next: "cfaLevel3Pattern" },
      { label: "📦 Study Material", next: "cfaLevel3Material" },
      { label: "🔙 Back", next: "cfa" },
    ],
    fees: [
      { label: "💸 CFA Fees", next: "cfaFees" },
      { label: "💸 FRM Fees", next: "frmFees" },
      { label: "🏷️ Discounts", next: "discounts" },
      { label: "🔙 Back", next: "main" },
    ],
    register: [
      { label: "📍 Offline Registration", next: "offline" },
      { label: "🖥️ Online Registration", next: "online" },
      { label: "🔙 Back", next: "main" },
    ],
  };

  const responses = {
    cfaLevel1Syllabus: "Level 1 covers Ethics, Quant, FRA, Corp Fin, etc.",
    cfaLevel1Dates: "Exams held Feb, May, Aug, and Nov. Visit CFA Institute.",
    cfaLevel1Mocks: "We provide 5 full-length mock tests with solutions.",
    cfaLevel2Topics:
      "Level 2 is item-set based. Topics include Equity, FI, Derivatives.",
    cfaLevel2Reg: "Register via CFA Institute. Coaching starts every 2 months.",
    cfaLevel3Pattern:
      "Essay + item-set based exam. Coaching includes practice papers.",
    cfaLevel3Material:
      "You’ll get videos, notes, mocks and doubt-solving support.",
    cfaFees: "Starts at ₹35,000. Installment options available.",
    frmFees: "FRM courses start at ₹30,000. Includes both parts.",
    discounts: "Early bird discounts available. Contact support!",
    offline: "Visit our center in Kolkata to register physically.",
    online: "Go to our website and complete the online form.",
    call: "📞 Call us at +91-9000000000 for help with anything!",
  };

  useEffect(() => {
    addBot("Hi! What's your name?");
  }, []);

  const addBot = (text, options = null) => {
    setTyping(true);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { from: "bot", text, options }]);
      setTyping(false);
    }, 600);
  };

  const addUser = (text) => {
    setChatHistory((prev) => [...prev, { from: "user", text }]);
  };

  const handleUserInput = (input) => {
    addUser(input);
    if (step === 0) {
      setUser((prev) => ({ ...prev, name: input }));
      setStep(1);
      addBot(`Nice to meet you, ${input}! What's your mobile number?`);
    } else if (step === 1) {
  if (!/^\d{10}$/.test(input)) {
    addBot("❗ Please enter a valid 10-digit mobile number.");
    return;
  }
  setUser((prev) => ({ ...prev, phone: input }));
  setStep(2);
  setMenuStack(["main"]);
  addBot("Thanks! How can I help you today?", menus["main"]);

    }
  };

  const handleOptionClick = (opt) => {
    addUser(opt.label);
    if (menus[opt.next]) {
      setMenuStack((prev) => [...prev, opt.next]);
      setTimeout(() => addBot("Choose an option:", menus[opt.next]), 400);
    } else if (opt.next === "main") {
      setMenuStack(["main"]);
      addBot("Back to main menu:", menus["main"]);
    } else {
      addBot(responses[opt.next] || "Coming soon...");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <span>🟢 Online</span>
        <a href="tel:+919000000000" title="Call us" style={styles.callIcon}>
          📞
        </a>
      </div>
      <div style={styles.chatBox}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
              backgroundColor: msg.from === "bot" ? "#eee" : "#daf1da",
            }}
          >
            <div>{msg.text}</div>
            {msg.options && (
              <div style={styles.bubbleGroup}>
                {msg.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    style={styles.bubbleButton}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ ...styles.message, fontStyle: "italic" }}>
            Typing...
          </div>
        )}
      </div>
      {step <= 1 && (
        <div style={styles.inputArea}>
          <input
            type={step === 0 ? "text" : "tel"}
            placeholder={step === 0 ? "Enter your name" : "Enter phone number"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUserInput(e.target.value);
                e.target.value = "";
              }
            }}
            style={styles.input}
          />
          <button
            onClick={(e) => {
              const val = e.target.previousSibling.value;
              handleUserInput(val);
              e.target.previousSibling.value = "";
            }}
            style={styles.button}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: 500,
    margin: "40px auto",
    fontFamily: "Arial",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    backgroundColor: "#f5f5f5",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  callIcon: {
    fontSize: "20px",
    textDecoration: "none",
  },
  chatBox: {
    height: "420px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#f9f9f9",
    overflowY: "auto",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "80%",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  bubbleGroup: {
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  bubbleButton: {
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default Chatbot;
// Chatbot code will go here
