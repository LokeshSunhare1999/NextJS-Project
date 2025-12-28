import { useEffect } from "react";

export default function FreshworksWidget() {
  useEffect(() => {
    const WIDGET_ID = process.env.NEXT_PUBLIC_FRESHWORK_WIDGET_ID;
    if (!WIDGET_ID) return;

    window.fwSettings = { widget_id: WIDGET_ID };

    if (typeof window.FreshworksWidget !== "function") {
      const fw = function () {
        (fw.q = fw.q || []).push(arguments);
      };
      window.FreshworksWidget = fw;
    }

    const script = document.createElement("script");
    script.id = "freshworks-widget";
    script.src = `https://ind-widget.freshworks.com/widgets/${WIDGET_ID}.js`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const cleanupSelector = [
        'iframe[id^="launcher"]',
        'iframe[src*="freshworks"]',
        '[class*="launcher"]',
        ".freshworks-chat-widget",
        "#freshworks-frame",
        "#freshworks-container",
        "#freshworks-frame-styles",
      ];
      cleanupSelector.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          try {
            el?.remove();
          } catch (err) {
            console.warn("Freshworks element remove error:", err);
          }
        });
      });

      const widgetScript = document.getElementById("freshworks-widget");
      try {
        widgetScript?.remove();
      } catch (err) {
        console.warn("Widget script remove error:", err);
      }

      delete window.FreshworksWidget;
      delete window.fwSettings;
    };
  }, []);

  return null;
}
