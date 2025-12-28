export function triggerEvent(eventName, customData = {}) {
  if (typeof window === "undefined") return;

  const storedUTMParams = sessionStorage.getItem("utmParams");
  let eventPayload = { event: eventName };

  if (storedUTMParams) {
    const utmData = JSON.parse(storedUTMParams);
    eventPayload = { ...eventPayload, ...utmData };
  }

  if (customData && typeof customData === "object") {
    eventPayload = { ...eventPayload, ...customData };
  }

  window.dataLayer.push(eventPayload);
}

export function captureAndStoreUTMParams() {
  const paramsToCapture = ["utm_medium", "utm_campaign", "utm_source"];
  const urlParams = new URLSearchParams(window.location.search);
  const utmData = {};

  paramsToCapture.forEach((param) => {
    const value = urlParams.get(param);
    if (value) {
      utmData[param] = value;
    }
  });

  if (Object.keys(utmData).length > 0) {
    sessionStorage.setItem("utmParams", JSON.stringify(utmData));
  }
}
