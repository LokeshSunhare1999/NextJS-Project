const config = {
  theme: {
    extend: {
      boxShadow: {
        tiny: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        "purple-blue-gradient":
          "linear-gradient(90deg, #8F3AFF 0%, #006AFF 100%)",
      },
      screens: {
        xs: "480px", // Extra small devices
        sm: "640px", // Small devices (default in Tailwind)
        md: "768px", // Medium devices (default in Tailwind)
        lg: "1024px", // Large devices (default in Tailwind)
        xl: "1280px", // Extra large devices (default in Tailwind)
        "2xl": "1536px", // 2X large devices (default in Tailwind)
        "3xl": "1920px", // Ultra-large screens
        "4xl": "2560px", // 4K screens
        "5xl": "3200px", // Ultra-wide monitors
        portrait: { raw: "(orientation: portrait)" }, // Portrait mode
        landscape: { raw: "(orientation: landscape)" }, // Landscape mode
        retina: { raw: "(min-resolution: 2dppx)" }, // Retina screens
      },
    },
    listStyleType: {
      upperAlpha: "upper-alpha",
      lowerAlpha: "lower-alpha",
      decimal: "decimal",
      lowerRoman: "lower-roman",
      disc: "disc",
      circle: "circle",
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [],

};

export default config;
