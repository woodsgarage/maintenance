function doGet(e) {
  const sheetName = e.parameter.sheet || "Vehicles";
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);

  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const data = rows.map(r => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.type === "future") {
    scheduleFutureMaintenance(data);
  } else {
    appendMaintenanceRecord(data);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "success" })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Append normal maintenance record
function appendMaintenanceRecord(data) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Maintenance");
  sheet.appendRow([
    new Date(),
    (data.vin || "").toString().trim(),
    data.odometer || "",
    data.service || "",
    data.parts || "",
    data.notes || ""
  ]);
}

// Append future maintenance record
function scheduleFutureMaintenance(data) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("FutureMaintenance");
  sheet.appendRow([
    new Date(),
    (data.vin || "").toString().trim(),
    (data.planned_date || "").toString().trim(),
    data.service || "",
    data.notes || "",
    "NO", // notified_14
    "NO", // notified_7
    "NO", // notified_3
    "NO"  // notified_1
  ]);
}

// Send reminders at 14, 7, 3, 1 days before planned date
function sendScheduledReminders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("FutureMaintenance");
  if (!sheet) return;

  const rows = sheet.getDataRange().getValues();
  rows.shift(); // remove header

  const today = new Date();

  rows.forEach((row, i) => {
    const [timestamp, vin, plannedDateStr, service, notes, notified14, notified7, notified3, notified1] = row;
    const plannedDate = new Date(plannedDateStr);
    const diffDays = Math.ceil((plannedDate - today) / (1000*60*60*24));

    const sendEmail = (colIndex, intervalDays) => {
      if ((row[colIndex] || "NO") !== "YES" && diffDays <= intervalDays && diffDays >= 0) {
        MailApp.sendEmail(
          "youremail@example.com",
          `Maintenance Reminder for VIN ${vin}`,
          `Scheduled service: ${service}\nDate: ${plannedDateStr}\nNotes: ${notes}\nReminder: ${intervalDays} day(s) before`
        );
        sheet.getRange(i + 2, colIndex + 1).setValue("YES"); // i+2 because header
      }
    };

    sendEmail(5, 14);
    sendEmail(6, 7);
    sendEmail(7, 3);
    sendEmail(8, 1);
  });
}
