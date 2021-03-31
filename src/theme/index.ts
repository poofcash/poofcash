export const preset = {
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#499EE9",
    secondary: "#30c",
    muted: "#f6f6f9",
    gray: "#dddddf",
    highlight: "hsla(205, 100%, 40%, 0.125)",
  },
  fonts: {
    body: "Helvetica",
    heading: "inherit",
    monospace: "Helvetica",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    normal: 400,
    bold: 600,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    avatar: 48,
  },
  shadows: {
    card: "0 0 4px rgba(0, 0, 0, .125)",
  },
  // rebass variants
  text: {
    regular: {
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: [16],
      lineHeight: "20px",
    },
    bold: {
      fontWeight: "bold",
    },
    form: {
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: [12],
      lineHeight: "16px",
    },
    subtitle: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 12,
      lineHeight: "16px",
    },
    tableHeader: {
      fontWeight: "bold",
      fontStyle: "normal",
      fontSize: [12],
      lineHeight: "20px",
    },
  },
  variants: {
    avatar: {
      width: "avatar",
      height: "avatar",
      borderRadius: "circle",
    },
    card: {
      p: 2,
      bg: "background",
      boxShadow: "card",
    },
    link: {
      color: "primary",
      textDecoration: "none",
    },
    nav: {
      fontSize: 1,
      fontWeight: "bold",
      display: "inline-block",
      p: 2,
      color: "inherit",
      textDecoration: "none",
      ":hover,:focus,.active": {
        color: "primary",
      },
    },
  },
  buttons: {
    primary: {
      ":disabled": {
        color: "#BABABA",
        bg: "#F1F4F4",
      },
      color: "background",
      borderRadius: "32px",
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: "20px",
      bg: "primary",
    },
    outline: {
      variant: "buttons.primary",
      color: "primary",
      bg: "background",
      border: "2px solid #499EE9",
    },
    secondary: {
      variant: "buttons.primary",
      color: "background",
      bg: "secondary",
    },
    switcher: {
      bg: "transparent",
      borderRadius: 0,
      color: "text",
      mr: 1,
      ":focus": {
        outline: "none",
      },
      borderBottom: "2px solid transparent",
    },
    switcherSelected: {
      variant: "buttons.switcher",
      borderBottom: "2px solid black",
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)",
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: "1px solid",
      borderColor: "muted",
    },
  },
};

export default preset;
