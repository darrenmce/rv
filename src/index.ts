import { createServices } from './services';
import { createAPIServer } from './api';

async function initServer() {
  const services = await createServices();
  const server = createAPIServer(services);

  server.listen(8080, () => {
    console.log('listening on port', 8080);
  })
}

initServer();
