function addToLocalStorage(key, data) {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
}

function getFromLocalStorage(key) {
  const jsonData = localStorage.getItem(key);
  return jsonData ? JSON.parse(jsonData) : null;
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
function getFormattedDate(dateString) {
  const inputDate = dateString ? new Date(dateString) : "";
  return inputDate
    ? `${inputDate.getDate()}.${inputDate.getMonth() + 1}.${inputDate
        .getFullYear()
        .toString()
        .slice(-2)}`
    : "";
}
function getDayInWeek(dateString) {
  const date = new Date(dateString);
  const options = { weekday: "long" };
  const day = date.toLocaleDateString("he-IL", options); // 'he-IL' is for Hebrew locale
  return day.split(" ")[1];// ראשון | שני | שלישי | רביעי | חמישי | שישי | שבת
}
