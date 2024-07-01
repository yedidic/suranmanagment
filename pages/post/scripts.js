function addToLocalStorage(key, data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
}

function getFromLocalStorage(key) {
  const jsonData = localStorage.getItem(key);
  return jsonData ? JSON.parse(jsonData) : null;
}

function parseTextValue(template, data) {
  if (!data) {
    return "נא למלא את הטופס";
  }
  const replacedText = template
    .replace(/{formattedDate}/g, data.formattedDate)
    .replace(/{hour}/g, data.hour)
    .replace(/{subject}/g, data.subject)
    .replace(/{extensiveSubject}/g, data.extensiveSubject)
    .replace(/{cardcomLink}/g, data.cardcomLink);
  return replacedText;
}

const texts = [
  {
    copyButtonClassName: "copyPostButton",
    label: "פוסט לפרסום במדיה (יש להוסיף תמונה מה-AI)",
    icon: "fa-edit",
    getValue: () => {
      const storedData = getFromLocalStorage("webinarData");
      return parseTextValue(
        `וובינר עם סוראן
יתקיים ביום רביעי, {formattedDate}, בשעה {hour}.
בנושא: {subject}.
{extensiveSubject}

מחיר הרשמה מוקדמת (עד 14:00 ביום האירוע): 50 ש"ח.
מחיר הרשמה רגילה (אחרי 14:00 ביום האירוע): 60 ש"ח.

לחצו כאן להרשמה לוובינר:
{cardcomLink}

* לחווים קושי כלכלי בתקופה זו מוצע מחיר מוזל במסגרת ההרשמה המוקדמת.
* ההרשמה היא להשתתפות במפגש החי, ואינה כוללת קבלה של הקלטת המפגש.`,
        storedData
      );
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
  const inputDate = form.date.value ? new Date(form.date.value) : "";
  const formattedDate = inputDate
    ? `${inputDate.getDate()}.${inputDate.getMonth() + 1}.${inputDate
        .getFullYear()
        .toString()
        .slice(-2)}`
    : "";

  const hour = form.hour.value;
  const subject = form.subject.value;
  const extensiveSubject = form.extensiveSubject.value || "";
  const cardcomLink = form.cardcomLink.value;

  const webinarData = {
    formattedDate,
    date: form.date.value,
    hour: hour,
    subject: subject,
    extensiveSubject: extensiveSubject,
    cardcomLink: cardcomLink,
  };

  saveWebinarData(webinarData);
  updatePreview();
}

function saveWebinarData(data) {
  addToLocalStorage("webinarData", data);
  showToast(
    "הפוסט התעדכן",
    "יש ללחוץ על כפתור 'העתק' כדי להעתיק את הפוסט המעודכן",
    "orange"
  );
}

function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

function parseQueryParamsAndLocalData() {
  const queryParams = getQueryParams();
  const storedData = getFromLocalStorage("webinarData");
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

    savePostForm({ target: form });
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function updatePreview() {
  const previewElement = document.getElementById("postPreview");
  previewElement.innerText = texts[0].getValue();
}

document.addEventListener("DOMContentLoaded", parseQueryParamsAndLocalData);
document.addEventListener("DOMContentLoaded", updatePreview);
document.querySelector("#postForm").addEventListener("submit", savePostForm);

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

["date", "hour", "subject", "extensiveSubject", "cardcomLink"].forEach(
  (name) => {
    document
      .querySelector(`#postForm [name="${name}"]`)
      .addEventListener("blur", savePostForm);
  }
);
