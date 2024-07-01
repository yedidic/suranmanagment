const texts = [
  {
    label: "טקסט לפרסום באתר (ובפרסומים השונים) למעגלים אנרגטיים",
    icon: "fa-bolt",
    value: `זהו מעגל בתחום "ההבעה הרגשית האנרגטית", והוא מומלץ לאלה שמרגישים מנוסים ומיומנים בתהליכי ההבעה הרגשית הרגילה וההתנהלות המדויקת ביומיום (הוראת העשור הראשון), וכן לכל מי שהשתתפ/ה במעגלי ההבעה הרגשית האנרגטית ו'יצירת יש מאין' הקודמים או מאזינ/ה לקורס בנושא זה במסגרת תוכנית המנויים באתר.`,
  },
];

// Get the toast element
var myToast = document.getElementById("myToast");

// Initialize the Bootstrap toast object
var bsToast = new bootstrap.Toast(myToast);

// Function to show the toast
function showToast() {
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
  document.getElementById("pageSubject").innerText = "מעגלים אנרגטיים";
  const accordion = document.getElementById("accordion");
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
    copyButton.className = "copy-button btn btn-primary";
    copyButton.innerHTML = `<i class="fas fa-copy"></i> העתק`;
    copyButton.onclick = () => copyToClipboard(item.value);

    cardHeader.appendChild(h2);
    cardHeader.appendChild(copyButton);

    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse${index}`;
    collapseDiv.className = "collapse";
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-parent", "#accordion");

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerText = item.value;

    collapseDiv.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(collapseDiv);
    accordion.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", createAccordionItems);
