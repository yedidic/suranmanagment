const POST_BASE = `וובינר עם סוראן
יתקיים ביום {day}, {formattedDate}, בשעה {hour}.
בנושא: {subject}
{extensiveSubject}

מחיר הרשמה מוקדמת (עד 14:00 ביום האירוע): 50 ש"ח.
מחיר הרשמה רגילה (אחרי 14:00 ביום האירוע): 60 ש"ח.

לחצו כאן להרשמה לוובינר:
{cardcomLink}{energeticCircle}{doctorDisclaimer}

* לחווים קושי כלכלי בתקופה זו מוצע מחיר מוזל במסגרת ההרשמה המוקדמת.
* ההרשמה היא להשתתפות במפגש החי, ואינה כוללת קבלה של הקלטת המפגש.`;
const LOCAL_STORAGE_KEY = "firstPostData";

function parseTextValue(template, data) {
  if (!data) {
    return "נא למלא את הטופס";
  }
  const replacedText = template
    .replace(/{day}/g, getDayInWeek(data.date))
    .replace(/{formattedDate}/g, getFormattedDate(data.date))
    .replace(/{hour}/g, data.hour)
    .replace(/{subject}/g, data.subject)
    .replace(/{extensiveSubject}/g, data.extensiveSubject)
    .replace(/{cardcomLink}/g, data.cardcomLink)
    .replace(
      /{energeticCircle}/g,
      data.isEnergyCircle
        ? `\n\nזהו מעגל בתחום "ההבעה הרגשית האנרגטית", והוא מומלץ לאלה שמרגישים מנוסים ומיומנים בתהליכי ההבעה הרגשית הרגילה וההתנהלות המדויקת ביומיום (הוראת העשור הראשון), וכן לכל מי שהשתתפ/ה במעגלי ההבעה הרגשית האנרגטית ו'יצירת יש מאין' הקודמים או מאזינ/ה לקורס בנושא זה במסגרת תוכנית המנויים באתר.`
        : ""
    )
    .replace(
      /{doctorDisclaimer}/g,
      data.doctorDisclaimer
        ? `\n\nהמידע שייאמר במעגל הינו בגדר כלי עזר בלבד ואינו מהווה המלצה ו/או תוכן לצורך קבלת החלטות כלשהן ו/או מחליף ייעוץ רופא ו/או גורם רפואי אחר ו/או ייעוץ מקצועי מכל סוג שהוא.`
        : ""
    );

  return replacedText;
}

const texts = [
  {
    copyButtonClassName: "copyPostButton",
    label: "פוסט לפרסום במדיה (יש להוסיף תמונה מה-AI)",
    icon: "fa-edit",
    getValue: () => {
      const storedData = getFromLocalStorage(LOCAL_STORAGE_KEY);
      return parseTextValue(POST_BASE, storedData);
    },
  },
];

var myToast = document.getElementById("myToast");
var bsToast = new bootstrap.Toast(myToast);

function showToast(
  title = "העתקה בוצעה",
  message = "הטקסט הועתק ללוח",
  bgColor = "lightgreen"
) {
  const toastEl = document.querySelector("#myToast");
  toastEl.style = `background-color:${bgColor}`;
  toastEl.querySelector("strong.mr-auto").innerText = title;
  toastEl.querySelector(".toast-body").innerText = message;
  bsToast.show();
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showToast();
}

function savePostForm() {
  const form = document.querySelector("#postForm");

  const hour = form.hour.value;
  const subject = form.subject.value;
  const extensiveSubject = form.extensiveSubject.value || "";
  const cardcomLink = form.cardcomLink.value;
  const isEnergyCircle = !!form.energyCircle.checked;
  const doctorDisclaimer = !!form.doctorDisclaimer.checked;

  const webinarData = {
    date: form.date.value,
    hour: hour,
    subject: subject,
    extensiveSubject: extensiveSubject,
    cardcomLink: cardcomLink,
    isEnergyCircle,
    doctorDisclaimer,
  };

  saveWebinarData(webinarData);
  updatePreview();
}

function saveWebinarData(data) {
  addToLocalStorage(LOCAL_STORAGE_KEY, data);
  showToast(
    "הפוסט התעדכן",
    "יש ללחוץ על כפתור 'העתק' כדי להעתיק את הפוסט המעודכן",
    "orange"
  );
}

function parseQueryParamsAndLocalData() {
  const queryParams = getQueryParams();
  const storedData = getFromLocalStorage(LOCAL_STORAGE_KEY);
  const data = { ...(storedData || {}), ...(queryParams || {}) };

  if (Object.keys(data).length > 0) {
    const form = document.querySelector("#postForm");
    if (data.date) {
      form.date.value = data.date;
    }
    if (data.hour) {
      form.hour.value = data.hour;
    }
    if (data.subject) {
      form.subject.value = data.subject;
    }
    if (data.extensiveSubject) {
      form.extensiveSubject.value = data.extensiveSubject;
    }
    if (data.cardcomLink) {
      form.cardcomLink.value = data.cardcomLink;
    }
    if (data.isEnergyCircle) {
      form.energyCircle.checked = true;
    }
    if (data.doctorDisclaimer) {
      form.doctorDisclaimer.checked = true;
    }

    savePostForm({ target: form });
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function updatePreview() {
  const previewElement = document.getElementById("postPreview");
  previewElement.innerText = texts[0].getValue();
}

function createGoogleCalendarEvent({
  date,
  hour,
  subject,
  extensiveSubject,
  cardcomLink,
  isEnergyCircle,
}) {
  const title = `וובינר עם סוראן: ${subject}`;
  const startDateTime = new Date(`${date}T${hour}`)
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const endDateTime = new Date(
    new Date(`${date}T${hour}`).getTime() + 90 * 60 * 1000
  )
    .toISOString()
    .replace(/-|:|\.\d+/g, ""); // Adding 1.5 hour for the end time

  const eventDetails = parseTextValue(POST_BASE, {
    date,
    hour,
    subject,
    extensiveSubject,
    cardcomLink,
    isEnergyCircle,
  });

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent(
    eventDetails
  )}&location=${encodeURIComponent("Online")}&trp=true`;

  return url;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pageSubject").innerText = "מחולל פוסטים ראשוניים";
  parseQueryParamsAndLocalData();
  updatePreview();
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const message = texts[0].getValue();
  copyToClipboard(message);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const form = document.querySelector("#postForm");
  const params = new URLSearchParams(new FormData(form)).toString();
  const exportLink = `${window.location.origin}${window.location.pathname}?${params}`;
  copyToClipboard(exportLink);
});

document.getElementById("whatsappBtn").addEventListener("click", () => {
  const message = texts[0].getValue();
  const phoneNumber = "972544818488";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}&app_absent=0`;
  window.open(whatsappUrl, "_blank");
});

document.getElementById("gCalendarButton").addEventListener("click", () => {
  const storedData = getFromLocalStorage(LOCAL_STORAGE_KEY);
  const whatsappUrl = createGoogleCalendarEvent(storedData);
  window.open(whatsappUrl, "_blank");
});

[
  { name: "date", eventType: "blur" },
  { name: "hour", eventType: "blur" },
  { name: "subject", eventType: "blur" },
  { name: "extensiveSubject", eventType: "blur" },
  { name: "cardcomLink", eventType: "blur" },
  { name: "energyCircle", eventType: "change" },
  { name: "doctorDisclaimer", eventType: "change" },
].forEach(({ name, eventType }) => {
  document
    .querySelector(`#postForm [name="${name}"]`)
    .addEventListener(eventType, savePostForm);
});
