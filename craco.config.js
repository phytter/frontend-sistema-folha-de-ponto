const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#74604D', '@success-color' : '#a5a58d'},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
