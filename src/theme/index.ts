export const preset = {
  breakpoints: ["1080px", "1080px"],
  colors: {
    text: "#333333",
    accent: "#7C71FD",
    background: "#fff",
    primary: "#5352FC",
    secondary: "#bababa",
    muted: "#f6f6f9",
    gray: "#bababa",
    darkgray: "#8d8d8d",
    highlight: "hsla(205, 100%, 40%, 0.125)",
    box: "#F1F4F4",
    disabled: "#BDBDBD",
    link: "#7C71FC",
    modes: {
      dark: {
        text: "#FAFAFA",
        accent: "#5352FC",
        background: "#212121",
        primary: "#5352FC",
        secondary: "#bababa",
        muted: "#757575",
        gray: "#bababa",
        darkgray: "#BDBDBD",
        highlight: "hsla(205, 100%, 40%, 0.125)",
        box: "#363945",
        disabled: "#BDBDBD",
        link: "#7C71FC",
      },
    },
  },
  fonts: {
    heading: "Bold",
    regular: "Regular",
    bold: "Bold",
    demiBold: "DemiBold",
    medium: "Medium",
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 28, 32, 48, 64, 96],
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  space: [0, 4, 8, 16, 24, 32, 48, 64],
  letterSpacings: {
    small: "-0.05em",
  },
  sizes: {
    avatar: 48,
  },
  shadows: {
    card: "0 0 4px rgba(0, 0, 0, .125)",
  },
  text: {
    default: {
      color: "text",
    },
    title: {
      fontFamily: "Medium",
      fontSize: [28],
      lineHeight: "42px",
    },
    logo: {
      fontFamily: "DemiBold",
      color: "accent",
      fontSize: [20],
      lineHeight: "28px",
      letterSpacing: "small",
    },
    wallet: {
      fontFamily: "DemiBold",
      color: "accent",
      fontSize: [12],
      lineHeight: "16px",
    },
    account: {
      fontFamily: "DemiBold",
      color: "primary",
      fontSize: [12],
      lineHeight: "16px",
    },
    regular: {
      fontFamily: "Regular",
      fontSize: [18],
      lineHeight: "22px",
      color: "text",
    },
    regularGray: {
      fontFamily: "Regular",
      fontSize: [18],
      lineHeight: "22px",
      color: "darkgray",
    },
    bold: {
      fontFamily: "Bold",
      fontSize: 18,
      lineHeight: "20px",
      color: "text",
    },
    form: {
      fontStyle: "Regular",
      fontSize: [14],
      lineHeight: "16px",
      color: "darkgray",
    },
    subtitle: {
      fontStyle: "DemiBold",
      fontSize: [20, 18],
      lineHeight: ["24px", "20px"],
      letterSpacing: "-0.01rem",
      color: "text",
    },
    tableHeader: {
      color: "accent",
      fontFamily: "Medium",
      fontSize: [14],
      lineHeight: "20px",
    },
    summaryTitle: {
      color: "accent",
      fontFamily: "Medium",
      fontSize: [14],
      lineHeight: "20px",
    },
    largeNumber: {
      fontFamily: "DemiBold",
      fontSize: 24,
      lineHeight: "20px",
      color: "text",
    },
    reallyBigNumber: {
      fontFamily: "DemiBold",
      fontSize: 32,
      lineHeight: "20px",
      color: "text",
    },
  },
  variants: {
    avatar: {
      width: "avatar",
      height: "avatar",
      borderRadius: "circle",
    },
    link: {
      color: "link",
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
  select: {
    borderColor: "gray",
    borderWidth: "1.5px",
  },
  input: {
    borderColor: "gray",
    borderWidth: "1.5px",
  },
  buttons: {
    primary: {
      ":disabled": {
        color: "muted",
        cursor: "auto",
        bg: "disabled",
      },
      fontFamily: "Bold",
      fontSize: 18,
      lineHeight: "20px",
      cursor: "pointer",
      variant: "bold",
      borderRadius: ["32px", "6px"],
      height: ["48px", "42px"],
      color: "text",
      bg: "primary",
    },
    secondary: {
      variant: "buttons.primary",
      ":hover": {
        variant: "buttons.primary",
        ":disabled": {
          color: "gray",
          bg: "background",
        },
      },
      ":disabled": {
        borderColor: "gray",
        color: "gray",
        bg: "background",
      },
      fontFamily: "Bold",
      fontSize: 18,
      lineHeight: "20px",
      color: "text",
      bg: "background",
      border: "4px solid",
      borderColor: "primary",
    },
    done: {
      variant: "buttons.secondary",
      color: "accent",
    },
    switcher: {
      bg: "transparent",
      fontFamily: "DemiBold",
      fontSize: 20,
      lineHeight: "16px",
      letterSpacing: "-0.01rem",
      borderRadius: 0,
      borderBottom: "3px solid transparent",
      color: "gray",
      ":focus": {
        outline: "none",
      },
      cursor: "pointer",
      px: 0,
      mr: 3,
      mt: 2,
    },
    switcherSelected: {
      variant: "buttons.switcher",
      borderBottom: "3px solid",
      color: "text",
    },
  },
  styles: {
    root: {
      fontFamily: "Regular",
      lineHeight: "body",
    },
    countdown: {
      width: ["180px", "320px"],
      height: ["180px", "320px"],
      color: "accent",
    },
    a: {
      ":visited": {
        color: "link",
      },
      color: "link",
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.125)",
      bg: "box",
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
