import './startup';

import { HOST, PORT } from 'consts';
import Server from 'Server';

const server = new Server();

server.listen(PORT, HOST);
