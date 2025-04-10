import React, { useState, useEffect, useRef } from "react";

const logToSheet = async ({ name, phone, course, path }) => {
  const payload = {
    Timestamp: new Date().toLocaleString(),
    Name: name,
    Phone: phone,
    CourseInterest: course,
    MenuPath: path.join(" > ")
  };

  try {
    const res = await fetch("https://sheetdb.io/api/v1/ym6fwhocqsdzj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [payload] })
    });

    const result = await res.json();
    console.log("✅ SheetDB Response:", result);
  } catch (err) {
    console.error("❌ SheetDB logging failed:", err);
  }
};



const Chatbot = () => {
  const [step, setStep] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState({ : "", phone: "" });
  const [menuStack, setMenuStack] = useState([]);
  const chatRef = useRef(null);
  const [journey, setJourney] = useState([]);
  const [courseInterest, setCourseInterest] = useState("");

  const menus = {
    main: [
      { label: "📘 Courses", next: "courses" },
      { label: "📚 Resources", next: "resources" },
      { label: "🌱 Beyond Academics", next: "beyondAcademics" },
      { label: "ℹ️ About Us", next: "about" },
      { label: "📞 Contact Us", next: "contact" },
      { label: "🔐 Student Portal", next: "portal" },
      { label: "📄 Policies", next: "policies" },
      { label: "📢 Social Media", next: "social" },
      { label: "🛠 Support", next: "support" },
      { label: "🏅 Testimonials", next: "testimonials" },
    ],
    courses: [
      { label: "📘 CFA", next: "cfa" },
      { label: "📗 FRM", next: "frm" },
      { label: "📙 Upskill", next: "upskill" },
      { label: "🔙 Back", next: "main" },
    ],
    cfa: [
      { label: "📗 Level I", next: "cfaLevel1" },
      { label: "📘 Level II", next: "cfaLevel2" },
      { label: "📙 Level III", next: "cfaLevel3" },
      { label: "🔙 Back", next: "courses" },
    ],
    frm: [
      { label: "🧮 Part I", next: "frmPart1" },
      { label: "📊 Part II", next: "frmPart2" },
      { label: "🔙 Back", next: "courses" },
    ],
    upskill: [
      { label: "📊 MS Office", next: "msOffice" },
      { label: "📈 Finance for Non-Finance", next: "financeBasics" },
      { label: "🔙 Back", next: "courses" },
    ],
    resources: [
      { label: "🗓️ Calendar", next: "calendar" },
      { label: "❓ FAQ", next: "faq" },
      { label: "🧰 Toolkit", next: "toolkit" },
      { label: "📚 Material", next: "material" },
      { label: "🛍️ Merchandise", next: "merch" },
      { label: "🔙 Back", next: "main" },
    ],
    beyondAcademics: [
      { label: "🧑‍🎓 Alumni Network", next: "alumni" },
      { label: "💼 Placement Assistance", next: "placement" },
      { label: "🏆 Competitions", next: "competitions" },
      { label: "🚀 Leveraged Learning", next: "learning" },
      { label: "📝 Blogs", next: "blogs" },
      { label: "🔙 Back", next: "main" },
    ],
    about: [
      { label: "🎯 Mission & Vision", next: "vision" },
      { label: "👨‍🏫 Your Mentor", next: "mentor" },
      { label: "💡 Why Us?", next: "whyUs" },
      { label: "🔙 Back", next: "main" },
    ],
    contact: [
      { label: "📍 Address", next: "address" },
      { label: "📞 Phone", next: "phone" },
      { label: "📧 Email", next: "email" },
      { label: "🔙 Back", next: "main" },
    ],
    portal: [
      { label: "🔐 Login", next: "login" },
      { label: "📝 Register", next: "register" },
      { label: "📌 Noticeboard", next: "noticeboard" },
      { label: "📱 Our App", next: "app" },
      { label: "🧑‍💻 Our Software", next: "software" },
      { label: "🌟 Testimonials", next: "testimonials" },
      { label: "🔙 Back", next: "main" },
    ],
    policies: [
      { label: "📄 Terms & Conditions", next: "terms" },
      { label: "🔒 Privacy Policy", next: "privacy" },
      { label: "💸 Refund Policy", next: "refund" },
      { label: "🔙 Back", next: "main" },
    ],
    social: [
      { label: "📹 YouTube", next: "youtube" },
      { label: "📸 Instagram", next: "instagram" },
      { label: "📘 Facebook", next: "facebook" },
      { label: "🔙 Back", next: "main" },
    ],
    support: [
      { label: "🔧 Technical Support", next: "techSupport" },
      { label: "💬 Doubt Forum", next: "doubtForum" },
      { label: "🎓 Exam Mentoring", next: "mentoring" },
      { label: "🔙 Back", next: "main" },
    ],
    testimonials: [
      { label: "🗣️ Student Feedback", next: "feedback" },
      { label: "🏅 Success Stories", next: "success" },
      { label: "🔙 Back", next: "main" },
    ],
  };

  const responses = {
    cfaLevel1:
      "CFA Level I includes 350+ hours of lectures, practice, and mentoring. Best to start 3 years before graduation. Fee: \u20b917,001.",
    cfaLevel2:
      "CFA Level II is a 200+ hour program tailored for final-year students or those who have cleared Level I. This course emphasizes 'Item Set' multiple-choice questions, building upon Level I concepts with detailed practice and personalized mentoring. The fee for this program is ₹19,001.",
    cfaLevel3:
      "CFA Level III is designed for graduates or individuals who have cleared Level II. This 180-hour program prepares candidates for essay-type questions and integrates cross-subject concepts through focused mentoring. The fee for this program is ₹19,001.",
    frmPart1:
      "FRM Part I is 260+ hours, suitable for CFA Level II candidates or graduates. Covers foundational risk topics. Fee: \u20b917,001.",
    frmPart2:
      "FRM Part II is a 190+ hour program that builds a strong foundation in quantitative analysis, derivatives, and fixed income. It aims to enhance accuracy for tackling 100 multiple-choice questions. The fee for this program is ₹19,001.",
    msOffice:
      "MS Office Upskill includes: Excel, Word, PowerPoint, Data Management. 25+ hours for \u20b92,800. Build dashboards and automate reports.",
    financeBasics:
      "Finance for Non-Finance is delivered through Leveraged Growth workshops and internal mentoring.",
    calendar: "Access exam and course dates directly on our calendar page.",
    faq: "Explore our FAQ grouped by Class & Institute at: https://aswinibajajclasses.com/resources/faq",
    toolkit:
      "Toolkit includes tools like: 'When to Register?', 'Am I Eligible?', and decision-making guides.",
    material:
      "Study Material includes updated syllabus, formula sheets, quizzes, simulations, and changes.",
    merch:
      "Our exclusive IIY Journal helps with tracking and productivity. Visit the Merchandise section.",
    alumni:
      "Connect with alumni and read success stories at: https://alumni.aswinibajaj.com",
    placement:
      "Find jobs and internships curated for finance at: https://cfafrmjobs.com",
    competitions:
      "We host institute-wide finance simulations and competitive challenges.",
    learning:
      "Leveraged Learning offers discussions, career pathways, and expert talks.",
    blogs:
      "Visit our blogs on careers, tech skills, and industry trends:\n\u2022 blog.xlinxl.in\n\u2022 blog.leveragedgrowth.in\n\u2022 blog.aswinibajaj.com",
    vision:
      "We aim to empower global finance professionals through mentoring and practical education.",
    mentor:
      "Aswini Bajaj holds CA, CS, CFA, FRM, CAIA, CIPM, CFP, RV, and more. Over 30,000 students trained in 100+ countries.",
    whyUs:
      "Why choose us? Personalized coaching, lifetime mentoring, and a practical learning approach.",
    address:
      "2nd Floor, Rear Building, 50, Chowringhee Rd, Elgin, Kolkata, West Bengal 700071.",
    phone: "\ud83d\udcde +91-9831779747",
    email: "\ud83d\udce7 contact@aswinibajajclasses.com",
    login: "Login at: https://portal.aswinibajaj.com",
    register:
      "Register for classes via our website or visit our center in Kolkata.",
    noticeboard:
      "Get real-time updates via the noticeboard in our student portal and app.",
    app: "Download our app to access lectures, notes, mock tests, and performance tracking.",
    software:
      "Our software supports LMS, performance tracking, and online classes.",
    testimonials:
      "Check what students say about us in the Testimonials section.",
    terms: "Read our full Terms & Conditions on the website.",
    privacy:
      "We ensure complete privacy of your data. Read our privacy policy online.",
    refund:
      "Refund policy is strict. Refer to the Refund section on our official page.",
    youtube:
      "\ud83c\udfa5 Follow us on YouTube for free sessions, tips, and guidance.",
    instagram:
      "\ud83d\udcf8 Follow us on Instagram @aswinibajajclasses for latest updates.",
    facebook:
      "\ud83d\udcd8 Like us on Facebook to join the community: fb.com/aswinibajajclasses",
    techSupport:
      "Facing issues? Our technical team is just a call or email away.",
    doubtForum:
      "Join our internal doubt forum to get questions solved by experts.",
    mentoring:
      "Mentoring lectures cover exam guidance, preparation hacks, and last-minute tips.",
    feedback:
      "Our students share their learning journeys and results under 'Student Feedback'.",
    success:
      "See how our mentoring has helped students succeed \u2014 check Success Stories on the website.",
  };

  useEffect(() => {
    addBot("Hi there from Team Aswini Bajaj! What's your name?");
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory, typing]);

  const addBot = (text, options = null) => {
    setTyping(true);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { from: "bot", text, options }]);
      setTyping(false);
    }, 700);
  };

  const addUser = (text) => {
    setChatHistory((prev) => [...prev, { from: "user", text }]);
  };

  const handleUserInput = (input) => {
    addUser(input);

    if (step === 0) {
      setUser((prev) => ({ ...prev, : input }));
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

      // log to sheet
      logToSheet({
        : user.,
        phone: input,
        course: courseInterest,
        path: journey,
      });
    }
  };

  const handleOptionClick = (opt) => {
    addUser(opt.label);

   setJourney((prev) => [...prev, opt.label]);

const isLeaf = !menus[opt.next]; // no further submenu = leaf

if (isLeaf && user.name && user.phone) {
  logToSheet({
    name: user.name,
    phone: user.phone,
    course: opt.label, // their final selected option
    path: [...menuStack.map(k => k), opt.next]
  });
}



    // BACK button handler
    if (opt.next === "back") {
      const updatedStack = [...menuStack];
      updatedStack.pop(); // remove current
      const last = updatedStack.pop(); // go to previous
      const goTo = last || "main";
      setMenuStack((prev) => [...prev, goTo]);
      addBot("Back to previous menu:", menus[goTo]);
      return;
    }

    // If menu exists, go deeper
    if (menus[opt.next]) {
      setMenuStack((prev) => [...prev, opt.next]);
      addBot("Choose an option:", menus[opt.next]);
    }
    // Fallback to responses or default
    else {
      const lastMenu = menuStack[menuStack.length - 1] || "main";
      const responseText =
        responses[opt.next] ||
        "❓ I don't have knowledge about this. Please call us at 📞 +91-9831779747.";

      const fallbackButtons = [
        { label: "🔙 Back", next: "back" },
        { label: "➕ Ask another question", next: "main" },
      ];

      addBot(responseText, fallbackButtons);
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

      <div ref={chatRef} style={styles.chatBox}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.from === "bot" ? "flex-start" : "flex-end",
              backgroundColor: msg.from === "bot" ? "#f1f1f1" : "#daf1da",
            }}
          >
            <strong>{msg.from === "bot" ? "🤖" : "👤"} </strong>
            {msg.text}
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
            <strong>🤖</strong> Typing<span className="dots">...</span>
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
    maxWidth: "100%",
    width: 420,
    margin: "20px auto",
    fontFamily: "'Segoe UI', sans-serif",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f3f4f6",
  },
  topBar: {
    backgroundColor: "#1E4BB8",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
  },
  callIcon: {
    fontSize: "22px",
    textDecoration: "none",
    color: "white",
  },
  chatBox: {
    height: "450px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
    backgroundImage: "url('/pattern.png')", // add image to public folder
    backgroundSize: "contain",
  },
  message: {
    padding: "14px 16px",
    borderRadius: "16px",
    maxWidth: "80%",
    wordBreak: "break-word",
    fontSize: "15px",
    lineHeight: "1.5",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  inputArea: {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "16px",
    borderRadius: "24px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    borderRadius: "50%",
    backgroundColor: "#1E4BB8",
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
    padding: "10px 14px",
    fontSize: "14px",
    backgroundColor: "#e6ecff",
    color: "#1E4BB8",
    border: "1px solid #d0d9ff",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default Chatbot;
