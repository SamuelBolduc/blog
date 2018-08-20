module.exports = (config) => [
  require("stylelint")(),
  require("postcss-cssnext")({
    browsers: "last 2 versions",
    features: {
      customProperties: {
        variables: {
          maxWidth: "60rem",
          colorPrimaryDark: "#5A1807",
          colorPrimary: "#55251D",
          colorSecondaryDark: "#696047",
          colorSecondary: "#92AC86",
          colorNeutralDark: "#111",
          colorNeutral: "#8C8D91",
          colorNeutralLight: "#FBFCFC",
          colorText: "#555",
        },
      },
    },
  }),
  require('cssnano')({autoprefixer: false}),
  require("postcss-reporter")({
    plugins: ['!postcss-discard-empty'] // https://github.com/ben-eb/cssnano/issues/212
  }),
  ...!config.production ? [
    require("postcss-browser-reporter")(),
  ] : [],
];
