const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              // Primaries
              '@primary-color': '#722ed1',
              '@link-color' : '#d3adf7', 
              '@success-color' : '#73d13d', 
              '@warning-color' : '#c41d7f', 
              '@error-color' : '#f5222d', 
              '@heading-color' : 'rgba(0,0,0,0.85)', 
              '@text-color' : 'rgba(0,0,0,0.65)', 
              '@border-radius-base' : '8px', 
              '@border-color-base' : '#d5d5d5', 
              '@font-size-base' : '14px',

              // Dropdown

              '@dropdown-menu-bg': '#eeeeee',


              // card

            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};