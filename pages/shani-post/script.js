const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyHUykUJn124B7zBwCWAPsn8PBaerf4Mzc0YfV4TiAdRPQkbiF49M5fVqtZJNZyc-Tn/exec";

const chat = document.getElementById("chat");
const questionInput = document.getElementById("question");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const stopMicButton = document.getElementById("stopMicButton");
let recognition = null;
let isListening = false;

sendButton.addEventListener("click", ask);
micButton.addEventListener("click", startListening);
stopMicButton.addEventListener("click", stopListening);

questionInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    ask();
  }
});

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function ask() {
  const question = questionInput.value.trim();

  if (!question) return;

  addMessage(question, "user");

  questionInput.value = "";
  sendButton.disabled = true;
  micButton.disabled = true;

  callAppsScriptSearch(question)
    .then(function (response) {
      addMessage(response.message || "לא התקבלה תשובה תקינה.", "bot");

      renderWhatsappButtons(response.results || []);

      speak(response.message || "");

      sendButton.disabled = false;
      micButton.disabled = false;
      questionInput.focus();
    })
    .catch(function (error) {
      addMessage("אירעה שגיאה: " + error.message, "bot");

      sendButton.disabled = false;
      micButton.disabled = false;
      questionInput.focus();
    });
}

function callAppsScriptSearch(question) {
  return new Promise(function (resolve, reject) {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PUT_YOUR")) {
      reject(new Error("לא הוגדרה כתובת Apps Script בקובץ script.js."));
      return;
    }

    const callbackName =
      "jsonpCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);

    const script = document.createElement("script");

    const timeout = setTimeout(function () {
      cleanup();
      reject(new Error("החיבור ל־Apps Script לקח יותר מדי זמן."));
    }, 15000);

    window[callbackName] = function (data) {
      cleanup();
      resolve(data);
    };

    function cleanup() {
      clearTimeout(timeout);

      if (window[callbackName]) {
        delete window[callbackName];
      }

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    const url =
      APPS_SCRIPT_URL +
      "?action=search" +
      "&q=" +
      encodeURIComponent(question) +
      "&callback=" +
      encodeURIComponent(callbackName);

    script.src = url;

    script.onerror = function () {
      cleanup();
      reject(new Error("לא הצלחתי להתחבר ל־Apps Script."));
    };

    document.body.appendChild(script);
  });
}

function renderWhatsappButtons(results) {
  if (!results || results.length === 0) return;

  results.forEach(function (result) {
    if (!result.whatsappUrl) return;

    const wrapper = document.createElement("div");
    wrapper.className = "message bot whatsapp-card";

    const fullName = `${result.firstName || ""} ${result.family || ""}`.trim();

    const title = document.createElement("div");
    title.className = "whatsapp-card-title";
    title.textContent = `${fullName} — תיבה ${result.mailbox || ""} — טלפון ${result.phone || ""}`;

    const actions = document.createElement("div");
    actions.className = "whatsapp-actions";

    const previewButton = document.createElement("button");
    previewButton.textContent = "הצג נוסח";
    previewButton.type = "button";
    previewButton.className = "preview-button";

    const whatsappButton = document.createElement("button");
    whatsappButton.textContent = "שליחת WhatsApp";
    whatsappButton.type = "button";
    whatsappButton.className = "whatsapp-button";

    const previewBox = document.createElement("div");
    previewBox.className = "preview-box";
    previewBox.textContent = result.whatsappMessage || "";

    previewButton.onclick = function () {
      const isVisible = previewBox.style.display === "block";

      if (isVisible) {
        previewBox.style.display = "none";
        previewButton.textContent = "הצג נוסח";
      } else {
        previewBox.style.display = "block";
        previewButton.textContent = "הסתר נוסח";
      }

      chat.scrollTop = chat.scrollHeight;
    };

    whatsappButton.onclick = function () {
      window.open(result.whatsappUrl, "_blank");
    };

    actions.appendChild(previewButton);
    actions.appendChild(whatsappButton);

    wrapper.appendChild(title);
    wrapper.appendChild(actions);
    wrapper.appendChild(previewBox);

    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;
  });
}

function startListening() {
  if (isListening) {
    stopListening();
    return;
  }

  addMessage("נלחץ כפתור המיקרופון.", "bot");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    addMessage(
      "הדפדפן הזה לא תומך בזיהוי דיבור דרך JavaScript. נסה לפתוח את האתר ב־Google Chrome.",
      "bot",
    );
    return;
  }

  try {
    recognition = new SpeechRecognition();

    recognition.lang = "he-IL";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      isListening = true;
      micButton.textContent = "⏹️";
      micButton.title = "עצור הקלטה";
      addMessage("אני מקשיב... לחץ שוב על הכפתור כדי לעצור.", "bot");
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;

      addMessage("שמעתי: " + transcript, "bot");

      questionInput.value = transcript;
      ask();
    };

    recognition.onerror = function (event) {
      let message = "אירעה שגיאה בזיהוי הדיבור: " + event.error;

      if (event.error === "not-allowed") {
        message = "הגישה למיקרופון חסומה. צריך לאשר הרשאת מיקרופון בדפדפן.";
      }

      if (event.error === "no-speech") {
        message =
          'לא שמעתי דיבור. נסה שוב ולדבר אחרי שמופיעה ההודעה "אני מקשיב".';
      }

      if (event.error === "audio-capture") {
        message = "לא נמצא מיקרופון פעיל במכשיר.";
      }

      if (event.error === "network") {
        message = "אירעה שגיאת רשת בזיהוי הדיבור. נסה שוב ב־Chrome.";
      }

      addMessage(message, "bot");
    };

    recognition.onend = function () {
      isListening = false;
      micButton.textContent = "🎤";
      micButton.title = "התחל הקלטה";
    };

    recognition.start();
  } catch (error) {
    addMessage("לא הצלחתי להפעיל את המיקרופון: " + error.message, "bot");
    isListening = false;
    micButton.textContent = "🎤";
    micButton.title = "התחל הקלטה";
  }
}

function stopListening() {
  if (!recognition || !isListening) return;

  try {
    recognition.stop();
    addMessage("עצרתי את ההאזנה.", "bot");
  } catch (error) {
    addMessage("לא הצלחתי לעצור את המיקרופון: " + error.message, "bot");
  } finally {
    isListening = false;
    micButton.textContent = "🎤";
    micButton.title = "התחל הקלטה";
  }
}

function speak(text) {
  if (!text || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    // הצ׳אט עובד גם בלי הקראה קולית.
  }
}
