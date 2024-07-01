const texts = [
    {
      label: 'פתיחה - "שלום סוראן"',
      value: `כשסוראן יברך אותנו לשלום, ניתן יהיה לפתוח מיקרופון באופן עצמאי ולענות. 
  ואחר כך - סיגרו אותו בבקשה.`,
      icon: "fa-door-open",
    },
    {
      label: "הרמת יד לשאלה",
      value: `כשסוראן יזמין אותנו לשאול או לשתף במהלך המעגל  - תוכלו לבקש רשות דיבור על ידי הרמת "יד וירטואלית", זאת בעזרת כפתור 
  Raise Hand
  
  תמצאו אותו בכפתור 
  Reactions או React
  בסרגל התחתון. 
  (וכך גם בטלפון הסלולרי) 
  
  (בגרסאות "זום" ישנות - בכפתור 
  Participants
  או בשלוש הנקודות שכתוב לידן
  more
  ואז לבחור
  raise hand)
  
  הרמתם יד כדי לשאול? השאירו את חלון הצ'ט פתוח כדי שנודיע לכם מתי תורכם לשאול. 
  
  נשמח שתשאלו כשמצלמתכם פועלת, אך ניתן לשאול גם בקולכם בלבד כשהמצלמה סגורה. לבחירתכם. 
  
  כדי לאפשר לכולם לשאול או לשתף - בבקשה הסתפקו בשאלה בלבד (במקרה שכל השואלים יסיימו לשאול, נזמין את מי שרוצה לשאול גם שנית).
  
  שימו לב, אם בחרתם לדבר בוובינר, קולכם יישמע בהקלטה שתפורסם בעתיד. זאת, אלא אם תבקשו להסיר את שאלתכם בפניה למייל 
  info@suran.co.il
  `,
      icon: "fa-hand-paper",
    },
    {
      label: 'סגירה - "להתראות סוראן"',
      value: `כשסוראן ייפרד מאיתנו לשלום, ניתן יהיה לפתוח מיקרופונים באופן עצמאי ולענות. 
  ואז… לסגור אותם בבקשה.
  
  הישארו איתנו עוד כמה דקות גם אחרי שסוראן יסיים - עד לסיום המפגש.`,
      icon: "fa-door-closed",
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
      button.innerHTML =
        `<i class="fas ${item.icon} ml-4"></i>` + item.label;
  
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
  