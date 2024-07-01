function parseTextValue(template, data) {
  if (!data) {
    return "נא למלא את הטופס";
  }
  const replacedText = template
    .replace(/{richText}/g, data.richText)
    .replace(/{day}/g, getDayInWeek(data.date))
    .replace(/{date}/g, getFormattedDate(data.date))
    .replace(/{hour}/g, data.hour)
    .replace(/{subject}/g, data.subject)
    .replace(/{registrationLink}/g, data.registrationLink);
  return replacedText;
}

const texts = [
  {
    copyButtonClassName: "copyPostButton",
    label: "פוסט שני לפרסום במדיה",
    icon: "fa-edit",
    getValue: () => {
      const storedData = getFromLocalStorage("secondPostData");
      return parseTextValue(
        `{richText}


מחר, יום {day}, {date}, ניפגש ב"זום" לוובינר עם סוראן:
{subject}


להרשמה: {registrationLink}
מייל לפניות ושאלות: info@suran.co.il
ציור: DALL E AI`,
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

  const richText = form.richText.value;
  const hour = form.hour.value;
  const subject = form.subject.value;
  const registrationLink = form.registrationLink.value;

  const secondPostData = {
    richText: richText,
    date: form.date.value,
    hour: hour,
    subject: subject,
    registrationLink: registrationLink,
  };

  saveSecondPostData(secondPostData);
  updatePreview();
}

function saveSecondPostData(data) {
  addToLocalStorage("secondPostData", data);
  showToast(
    "הפוסט התעדכן",
    "יש ללחוץ על כפתור 'העתק' כדי להעתיק את הפוסט המעודכן",
    "orange"
  );
}

function parseQueryParamsAndLocalData() {
  const queryParams = getQueryParams();
  const storedData = getFromLocalStorage("secondPostData");
  const data = { ...(storedData || {}), ...(queryParams || {}) };

  if (Object.keys(data).length > 0) {
    const form = document.querySelector("#postForm");
    if (data.richText) {
      form.richText.value = data.richText;
    }
    if (data.date) {
      form.date.value = data.date;
    }
    if (data.hour) {
      form.hour.value = data.hour;
    }
    if (data.subject) {
      form.subject.value = data.subject;
    }
    if (data.registrationLink) {
      form.registrationLink.value = data.registrationLink;
    }

    savePostForm({ target: form });
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function updatePreview() {
  const previewElement = document.getElementById("postPreview");
  previewElement.innerText = texts[0].getValue();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pageSubject").innerText = "מחולל פוסטים שני";
});
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

["richText", "date", "hour", "subject", "registrationLink"].forEach((name) => {
  document
    .querySelector(`#postForm [name="${name}"]`)
    .addEventListener("blur", savePostForm);
});
