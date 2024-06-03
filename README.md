# Running The ToDo List Application with React and Micro-Frontend


## Installations

#### Run the following command for all the MFEs to install the dependencies:

### `npm install -f`

#### Run the following command for all the MFEs to run the MFEs ans the main App:

### `npm run start`

The mail app will be running in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. 

The other two eill run on [http://localhost:3001](http://localhost:3001) and [http://localhost:3002](http://localhost:3002)

## Architectural Choices

- #### Used Create React App and Webpack 5 Module Federation because of their wide community support, documentations and stability.

- #### The main app will show the basic view to the ToDo lists. To add and delete, the other two MFEs will lazy load and bring to the scene.

- #### To facilitate data follow across teh application, a shared store designed and exposed as a service.

