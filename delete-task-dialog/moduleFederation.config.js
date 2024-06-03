const { dependencies } = require('./package.json');

module.exports = {
  name: 'deleteTaskDialog',
  filename: 'remoteEntry.js',
  exposes: {
    './DeleteTaskDialog': './src/DeleteTaskDialog.tsx'
  },
  remotes: {
    mainApp: 'mainApp@http://localhost:3000/remoteEntry.js',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      import: 'react',
      shareScope: 'default',
      requiredVersion: dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};
