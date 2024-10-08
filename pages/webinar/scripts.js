const texts = [
  {
    label: "ניהול המשתתפים בזמן המעגל",
    html: `
    <ul>
    <li>לוודא ששי הוסיף לפלייליסט שירים להפעלה בתחילת או בסוף המעגל.</li>
    <li>בתחילת המעגל או בבדיקת הסאונד לוודא שהמיק הנכון של שי הוא הפעיל.</li>
<li>להוסיף ספוטלייט לשי/סוראן</li>
<li>אחרי שסוראן נכנס לעדכן את השם של שי ל "Suran" ובסוף המעגל לעדכן ל"Shay Garbarz" (כמו בתחילת המעגל). </li>
<li>לוודא שעצרתי את שיתוף הסאונד של המחשב</li>
</ul>
</b><br><b>- ביטול אפשרות המשתתפים להשתיק את עצמם בתחילת המעגל:<br>

<div style="
    text-align: left;
" dir="ltr"><b>Inside "Participants"</b> ➡️ <i class="fas fa-square"></i> <span style="color:red;">UNCHECK: </span><i>"Allow participants to unmute themselves"</i><br>
<b>In Chat</b> ➡️ <i class="fas fa-check-square"></i>  <span style="color:red;">CHECK: </span> Participants can chat with ↘️ "Host and co-host"<br><br>
</div>בפתיחה ובסגירה, אחרי שסוראן אומר שלום או ערב טוב, ללחוץ, בתוך Participants:<br>
<div style="text-align: left;" dir="ltr"><b>"Allow participants to unmute themselves"</b></div>
ולוודא שכולם השתיקו לאחר מכן. אם לא, להשתיק אותם אחד אחד.<br><br>
<b><i>שאלות</i></b><br><br>


כשמישהו רוצה לשאול, יש לעשות לו:<br><i>"Ask to unmute"</i><br>
ואם הוידאו שלו סגור ורוצים לעודד אותו לפתוח:<br>
<i>"Ask video on"</i><br><br>
<b><i>Spotlight - Relevant only when asker's video is on</i></b><br><br>

<i>"Add Spotlight"</i><br>
לשואל החדש ואז
<br>
<i>"Remove Spotlight"</i><br>
לשואל הקודם<br><br><br>

<b>תשובה גנרית למי שלא רוצה לשאול בקול:</b><br>

היי, אנו מעדיפים שהשואלים ישאלו בקולם. זה גם מאפשר לסוראן לענות תשובה אישית יותר ולא כללית. יש באפשרותך לשאול רק במיקרופון, בלי לציין את שמך, ובלי מצלמה, ואפשר גם לשנות את שמך שמופיע לכינוי כללי. האם יש לך אפשרות לשאול במיקרופון במצב זה?<br><br>


אם משתתף מתקשה להרים יד לשאילת שאלה - יש כאן גיף להסבר התהליך במובייל:<br>
<a href="https://i.ibb.co/dQHGjdC/hand-raise-phone-explaination.gif">hand-raise-phone-explaination.gif</a><br><br>

<b>הערה לגבי וידאו:</b><br>

עוד נקודה קטנה היא שלפעמים כדאי להעיף מבט בכל הוידאואים. כבר היה לנו פעם אחת עירום. פעם אחת מפשעה. פעם אחת מישהו פולה פרעושים לחתול. ואינספור אוכלים ומדברים בטלפון וכו'.. במקרים חריגים אני סוגר להם וידאו.
`,
    icon: "fa-users-cog",
    nonCopyable: true,
  },
  {
    label: 'פתיחה - "שלום סוראן"',
    value: `כשסוראן יברך אותנו לשלום, ניתן יהיה לפתוח מיקרופון באופן עצמאי ולענות, ואחר כך - סיגרו אותו בבקשה.`,
    icon: "fa-door-open",
  },
  {
    label: "הסבר טכני על הרמת יד לשאלות",
    value: `כשסוראן יזמין אותנו לשאול או לשתף במהלך המעגל  - תוכלו לבקש רשות דיבור על ידי הרמת "יד וירטואלית", זאת בעזרת כפתור
Raise Hand
תמצאו אותו בכפתור
Reactions או React
בסרגל התחתון (וכך גם בטלפון הסלולרי).

[בגרסאות "זום" ישנות – בכפתור
Participants
או בשלוש הנקודות שכתוב לידן
more
ואז לבחור
raise hand]

הרמתם יד כדי לשאול? השאירו את חלון הצ'ט פתוח כדי שנודיע לכם מתי תורכם לשאול.

נשמח שתשאלו כשמצלמתכם פועלת, אך ניתן לשאול גם בקולכם בלבד כשהמצלמה סגורה. לבחירתכם.

כדי לאפשר לכולם לשאול או לשתף - בבקשה הסתפקו בשאלה אחת בלבד (במקרה שכל השואלים יסיימו לשאול, נזמין את מי שרוצה לשאול גם שנית).

שימו לב, אם בחרתם לדבר בוובינר, קולכם יישמע בהקלטה שתפורסם בעתיד. זאת, אלא אם תבקשו להסיר את שאלתכם בפניה למייל:
info@suran.co.il
`,
    icon: "fa-hand-paper",
  },
  {
    label: 'סגירה - "להתראות סוראן"',
    value: `כשסוראן ייפרד מאיתנו לשלום, ניתן יהיה לפתוח מיקרופונים באופן עצמאי ולענות. 
  ואז…
  לסגור אותם בבקשה.
  
  הישארו איתנו עוד כמה דקות גם אחרי שסוראן יסיים - עד לסיום המפגש.`,
    icon: "fa-door-closed",
  },
  // Add the new panel here
  {
    label: "סגירת המעגל",
    html: `1. <a href="https://drive.google.com/drive/folders/12qf3ZQtuU23n5M0P12AMZJPyZGb8uvOQ" target="_blank"><strong>הורדת הקלטת המעגל מהזום והעלאה לדרייב</strong></a>.<br>
2. <a href="https://docs.google.com/spreadsheets/d/1DAeFM2HxwXaXmyMPqpx4CVQRns9nd97IoCnCXi7MAFk/edit" target="_blank"><strong>הוספת משפט כיס לטבלה</strong></a>.<br>
3. <a href="https://docs.google.com/document/d/17ZC8WK2E9R5UbbYyuMed2K02Cd-rczHvcr_T_nNMY3o/edit" target="_blank"><strong>הוספה לרשימת כל המעגלים</strong></a>.`,
    icon: "fa-times-circle",
    nonCopyable: true,
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
  document.getElementById("pageSubject").innerText = "ניהול הוובינר בפועל";
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

    if (!item.nonCopyable) {
      const copyButton = document.createElement("button");
      copyButton.className = "copy-button btn btn-primary";
      copyButton.innerHTML = `<i class="fas fa-copy"></i> העתק`;
      copyButton.onclick = () => copyToClipboard(item.value);

      cardHeader.appendChild(h2);
      cardHeader.appendChild(copyButton);
    } else {
      cardHeader.appendChild(h2);
    }

    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse${index}`;
    collapseDiv.className = "collapse";
    collapseDiv.setAttribute("aria-labelledby", `heading${index}`);
    collapseDiv.setAttribute("data-parent", "#accordion");

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    if (item.value) {
      cardBody.innerText = item.value;
    }
    if (item.html) {
      cardBody.innerHTML = item.html;
    }

    collapseDiv.appendChild(cardBody);
    card.appendChild(cardHeader);
    card.appendChild(collapseDiv);
    accordion.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", createAccordionItems);
