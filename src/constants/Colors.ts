const redScale = {
  100: "#FAD6D3",
  200: "#F5ADA6",
  300: "#F1837A",
  400: "#EC5A4D",
  500: "#E73121",
  600: "#B9271A",
  700: "#8B1D14",
  800: "#5C140D",
  900: "#2E0A07",
};

const blueScale = {
  500: "#3B82F6",
};

const greenScale = {
  500: "#22C55E",
};

export const Colors = {
  light: {
    text: "#111827",
    background: "#F3F4F6",
    card: "#FFFFFF",
    tint: redScale[500],
    tabIconDefault: "#868d99",
    primary: redScale[500],
    border: "#E5E7EB",
    primaryButtonText: "#FFFFFF",
  },
  dark: {
    text: "#F9FAFB",
    background: "#111827",
    card: "#1F2937",
    tint: redScale[500],
    tabIconDefault: "#4B5563",
    primary: redScale[500],
    border: "#374151",
    primaryButtonText: "#FFFFFF",
  },
  reds: redScale,
  blues: blueScale,
  greens: greenScale,
};
