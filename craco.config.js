const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#1DA57A',
              '@link-color' : '#1890ff', 
              '@heading-color' : 'rgba(0,0,0,0.85)', 
              '@text-color' : 'rgba(0,0,0,0.65)', 
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};