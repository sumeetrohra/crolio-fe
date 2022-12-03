module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "login-background": "#262626",
        "login-background1": "#2a2b2d",
        "login-foreground1": "#1d1e20",
        "login-foreground": "#272E36",
        "layout-bg": "#1D1E20",
        "p-secondary": "#A0A1A3",
        "p-green": "#27BC94",
        "b-blue": "#1E7ADF",
        "b-inverted": "#1e7ae933",
        "input-border": "#6F7071",
        "modal-header": "#1f252b",
        hero: "#27282a",
      },
      fontFamily: {
        body: ["Roboto"],
      },
    },
  },
  plugins: [],
};
