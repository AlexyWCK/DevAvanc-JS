import express from 'express';
import YAML from 'yamljs';
import swaggerui from 'swagger-ui-express';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

// Create a new express application
const app = express();
// Create a new livereload server
const liveReloadServer = livereload.createServer({
  port: process.env.LIVERELOAD_PORT || 35729,
});
// Watch the yaml file for changes
liveReloadServer.watch('./swagger.yaml');
// Enable auto refresh for the browser
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});
// Add the livereload middleware to the express application
app.use(connectLivereload());

// Load the swagger.yaml file
const swaggerSpec = YAML.load('./swagger.yaml');
// Serve the swagger UI on the /api-docs route as middleware
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpec));

// Start the server
app.listen(3001, () => {
  console.log('Swagger UI available at http://localhost:3001/api-docs');
});