const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    style: true,
  }),
  addLessLoader({
    modifyVars: {
      '@layout-body-background': '#FFFFFF',
      '@layout-header-background': '#FFFFFF',
      '@lauout-footer-background': '#FFFFFF',
    },
    javascriptEnabled: true,
  }),
);
