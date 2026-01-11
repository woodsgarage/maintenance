const API_URL = "https://script.google.com/macros/s/AKfycbycjeUNgCdUSfuH5Ls4F9HAg5RFb4N6RsppROvT7zbFQqmpyOpobBbH8hnuKLNFaNzoRQ/exec";

function loadJSONP(url, callback) {
  return new Promise(resolve => {
    window[callback] = data => resolve(data);
    const s = document.createElement("script");
    s.src = `${url}&callback=${callback}`;
    document.body.appendChild(s);
  });
}

