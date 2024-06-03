const { dependencies } = require('./package.json');

module.exports = {
  name: 'mainApp',
  filename: 'remoteEntry.js',
  exposes: {
    './state': './src/state',    
  },
  remotes: {
    taskDialog: 'taskDialog@http://localhost:3001/remoteEntry.js',
    deleteTaskDialog: 'deleteTaskDialog@http://localhost:3002/remoteEntry.js',
    mainApp: 'mainApp@http://localhost:3000/remoteEntry.js'
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      import: 'react',
      shareScope: 'default',
      requiredVersion: dependencies.react,
      eager: true
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};
