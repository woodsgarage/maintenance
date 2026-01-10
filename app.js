const API_URL = "https://script.google.com/macros/s/AKfycbzJQ4RydJakpDXbQz_N0lSuFI8MwvXwZLRyCJ-DwNIBncKVUr3A5_ODsNQXLY2r8lrqHw/exec";

function loadJSONP(url, callback) {
  return new Promise(resolve => {
    window[callback] = data => resolve(data);
    const s = document.createElement("script");
    s.src = `${url}&callback=${callback}`;
    document.body.appendChild(s);
  });
}
