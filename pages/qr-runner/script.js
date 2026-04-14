const links = [
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/a7ff8c2d8_BarShaharPhotographer--14.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/ec8976cdc_2-IMG_8823.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/c9a4483de_4-IMG_8838.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/a17243e65_6-IMG_8856.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/2831a1a28_8-IMG_8867.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/b1d8d63f8_9-IMG_8873.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/484b6ce9b_12-95661920-fc41-4adc-a5bc-15ce61f87a06.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/c408d1ff6_13-9e0d6724-65e7-45f2-879c-c83d286d5522.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/d7325292a_BarShaharPhotographer--10.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/6c04fb471_BarShaharPhotographer--12.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/c2e55da8d_BarShaharPhotographer--3.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/aba9baa12_BarShaharPhotographer--28.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/1dcfebfdf_BarShaharPhotographer--6.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/ccb92c6b2_BarShaharPhotographer-.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/006c69b0e_BarShaharPhotographer--16.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/b8d77d2ed_BarShaharPhotographer--8.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/47e1d2e47_BarShaharPhotographer--18.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/7d263535a_BarShaharPhotographer--20.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/75c9ee107_BarShaharPhotographer--22.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/1a85a0be0_BarShaharPhotographer--24.jpg",
  "https://base44.app/api/apps/693b03554ada1e62adc5cb3f/files/mp/public/693b03554ada1e62adc5cb3f/52d3d0b57_BarShaharPhotographer--26.jpg",
];

const extractFileName = (url) => {
  const parts = url.split("/");
  return decodeURIComponent(parts[parts.length - 1]);
};

const extractQRCodeImgLink = (url) => {
  return `https://quickchart.io/qr?text=${encodeURIComponent(url)}`;
};

const createCell = (text, className = "") => {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  return td;
};

const createLinkCell = (url) => {
  const td = document.createElement("td");
  td.className = "col-link";

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "url";
  a.textContent = url;

  td.appendChild(a);
  return td;
};

const createImageCell = (src, alt, className) => {
  const td = document.createElement("td");
  const link = document.createElement("a");
  link.href = src;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  td.appendChild(link);
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.className = className;
  link.appendChild(img);
  return td;
};

const renderDashboard = (urls) => {
  const tbody = document.getElementById("dashboard-body");
  if (!tbody) return;

  const rows = urls.map((url, index) => {
    const tr = document.createElement("tr");
    const fileName = extractFileName(url);

    tr.appendChild(createCell(index + 1, "col-num"));
    tr.appendChild(createCell(fileName));
    tr.appendChild(createLinkCell(url));
    tr.appendChild(createImageCell(url, fileName, "thumb"));
    tr.appendChild(
      createImageCell(extractQRCodeImgLink(url), `QR for ${fileName}`, "qr"),
    );

    return tr;
  });

  tbody.replaceChildren(...rows);
};

renderDashboard(links);
