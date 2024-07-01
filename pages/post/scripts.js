function addToLocalStorage(key, data) {
  // Convert JavaScript object to a JSON string
  const jsonData = JSON.stringify(data);

  // Store the JSON string in localStorage under the specified key
  localStorage.setItem(key, jsonData);
}
function getFromLocalStorage(key) {
  // Retrieve the JSON string from localStorage for the specified key
  const jsonData = localStorage.getItem(key);

  // If data exists, parse JSON string back to JavaScript object and return it
  // Otherwise, return null or handle the absence of data accordingly
  return jsonData ? JSON.parse(jsonData) : null;
}

function parseTextValue(template, data) {
  if (!data) {
    return "נא למלא את הטופס";
  }
  // Replace placeholders with actual values from data
  const replacedText = template
    .replace(/{date}/g, data.date)
    .replace(/{hour}/g, data.hour)
    .replace(/{subject}/g, data.subject)
    .replace(/{extensiveSubject}/g, data.extensiveSubject)
    .replace(/{cardcomLink}/g, data.cardcomLink);

  // Return the replaced text
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
יתקיים ביום רביעי, {date} בשעה {hour}.
בנושא: {subject}.
{extensiveSubject}

מחיר הרשמה מוקדמת (עד 14:00 ביום האירוע): 50 ש"ח.
מחיר הרשמה רגילה (אחרי 14:00 ביום האירוע): 60 ש"ח.

לחצו כאן להרשמה לוובינר:
{cardcomLink}

* לחווים קושי כלכלי בתקופה זו מוצע מחיר מוזל במסגרת ההרשמה המוקדמת.
* ההרשמה היא להשתתפות במפגש החי, ואינה כוללת קבלה של הקלטת המפגש.
`,
        storedData
      );
    },
  },
];

// Get the toast element
var myToast = document.getElementById("myToast");

// Initialize the Bootstrap toast object
var bsToast = new bootstrap.Toast(myToast);

// Function to show the toast
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

function createAccordionItems() {
  document.getElementById("pageSubject").innerText = "מחולל פוסטים";
  const accordion = document.getElementById("accordion");
  accordion.innerHTML = "";
  texts.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const cardHeader = document.createElement("div");
    cardHeader.className =
      "card-header d-flex justify-content-between align-items-center";
    cardHeader.id = `heading${index}`;

    const h2 = document.createElement("h2");
    h2.className = "mb-0";

    const button = document.createElement("button");
    button.className = "btn btn-link flex-1";
    button.type = "button";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", `collapse${index}`);
    button.innerHTML = `<i class="fas ${item.icon} ml-4"></i>` + item.label;

    h2.appendChild(button);

    const copyButton = document.createElement("button");
    copyButton.className = `copy-button btn btn-primary ${
      item.copyButtonClassName || ""
    }`;
    copyButton.innerHTML = `<i class="fas fa-copy"></i> העתק`;
    const value = item.value || item.getValue();
    copyButton.onclick = () => copyToClipboard(value);

    cardHeader.appendChild(h2);
    cardHeader.appendChild(copyButton);

    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse${index}`;
    collapseDiv.className = "collapse";
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-parent", "#accordion");

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerText = value;

    collapseDiv.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(collapseDiv);
    accordion.appendChild(card);
  });
}

function submitPostForm(event = undefined) {
  const form = document.querySelector("#postForm"); // Use the form element passed as an argument

  const inputDate = form.date.value ? new Date(form.date.value) : "";
  const formattedDate = inputDate
    ? `${inputDate.getDate()}.${inputDate.getMonth() + 1}.${inputDate
        .getFullYear()
        .toString()
        .slice(-2)}`
    : "";

  const date = formattedDate;
  const hour = form.hour.value;
  const subject = form.subject.value;
  const extensiveSubject = form.extensiveSubject.value || "";
  const cardcomLink = form.cardcomLink.value;

  // Construct the webinarData object
  const webinarData = {
    date: date,
    hour: hour,
    subject: subject,
    extensiveSubject: extensiveSubject,
    cardcomLink: cardcomLink,
  };

  saveWebinarData(webinarData);
}

function saveWebinarData(data) {
  // Adding data to localStorage
  addToLocalStorage("webinarData", data);
  createAccordionItems();
  document.querySelector('[data-toggle="collapse"]').click();
  showToast(
    "הפוסט התעדכן",
    "יש ללחוץ על כפתור 'העתק' כדי להעתיק את הפוסט המעודכן",
    "orange"
  );
}

// Function to extract query parameters from URL
function getQueryParams() {
  const params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

// Function to parse query parameters and submit the form
function parseQueryParamsAndLocalData() {
  const queryParams = getQueryParams();
  const storedData = getFromLocalStorage("webinarData");
  const data = { ...(storedData || {}), ...(queryParams || {}) };

  if (Object.keys(data).length > 0) {
    // Get the form element
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

    // Call submitPostForm programmatically, passing the form as an argument
    submitPostForm({ target: form });
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
document.addEventListener("DOMContentLoaded", parseQueryParamsAndLocalData);
document.addEventListener("DOMContentLoaded", createAccordionItems);
document.querySelector("#postForm").addEventListener("submit", submitPostForm);

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
  const phoneNumber = "972559246140";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}&app_absent=0`;
  window.open(whatsappUrl, "_blank");
});

document
  .querySelector('#postForm [name="date"]')
  .addEventListener("blur", submitPostForm);
document
  .querySelector('#postForm [name="hour"]')
  .addEventListener("blur", submitPostForm);
document
  .querySelector('#postForm [name="subject"]')
  .addEventListener("blur", submitPostForm);
document
  .querySelector('#postForm [name="extensiveSubject"]')
  .addEventListener("blur", submitPostForm);
document
  .querySelector('#postForm [name="cardcomLink"]')
  .addEventListener("blur", submitPostForm);
