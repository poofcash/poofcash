export const preset = {
  breakpoints: ["1080px", "1080px"],
  colors: {
    purple25: "#F5F2FF",
    purple50: "#ECE6FE",
    purple100: "#CCC3FC",
    purple300: "#7C71FC",
    purple400: "#5352FC",
    black800: "#363945",

    primaryText: "#5352FC",
    secondaryBackground: "#F5F2FF",
    primary: "#5352FC",

    text: "#333333",
    primaryButtonText: "#FAFAFA",
    accent: "#7C71FD",
    background: "#fff",
    secondary: "#bababa",
    muted: "#f6f6f9",
    gray: "#bababa",
    darkgray: "#8d8d8d",
    highlight: "hsla(205, 100%, 40%, 0.125)",
    box: "#F1F4F4",
    disabled: "#BDBDBD",
    modes: {
      dark: {
        primaryText: "#CCC3FC",
        secondaryBackground: "#363945",
        primary: "#7C71FC",

        text: "#FAFAFA",
        primaryButtonText: "#FAFAFA",
        accent: "#5352FC",
        background: "#212121",
        secondary: "#bababa",
        muted: "#757575",
        gray: "#bababa",
        darkgray: "#BDBDBD",
        highlight: "hsla(205, 100%, 40%, 0.125)",
        box: "#363945",
        disabled: "#BDBDBD",
      },
    },
  },
  fonts: {
    heading: "Regular",
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
    primary: {
      fontFamily: "Regular",
      fontWeight: "500",
      fontSize: [16],
      lineHeight: "20px",
      color: "primaryText",
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
      color: "text",
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
      fontFamily: "Medium",
      fontSize: 16,
      fontWeight: 500,
      lineHeight: "20px",
      cursor: "pointer",
      borderRadius: "6px",
      height: ["48px", "42px"],
      color: "primaryButtonText",
      bg: "primary",
      px: 4,
      py: 2,
    },
    secondary: {
      variant: "buttons.primary",
      ":disabled": {
        borderColor: "gray",
        color: "gray",
        bg: "transparent",
      },
      color: "primary",
      bg: "transparent",
      border: "1px solid",
      borderColor: "primary",
    },
    done: {
      variant: "buttons.secondary",
      color: "accent",
    },
    switcher: {
      bg: "transparent",
      borderRadius: 0,
      fontFamily: "Regular",
      borderBottom: "2px solid transparent",
      color: "text",
      ":focus": {
        outline: "none",
      },
      cursor: "pointer",
      px: 0,
      py: 1,
      mr: 3,
    },
    switcherSelected: {
      variant: "buttons.switcher",
      borderBottom: "2px solid",
      color: "primaryText",
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
        color: "primaryText",
      },
      color: "primaryText",
      cursor: "pointer",
    },
    h1: {
      fontSize: 24,
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
    warning: {
      backgroundColor: "secondaryBackground",
      borderRadius: 4,
      color: "primaryText",
      px: 3,
      py: 2,
    },
  },
};

export default preset;
