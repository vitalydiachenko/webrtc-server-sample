import './startup';

import { HOST, PORT } from 'consts';
import server from 'server';

server.listen(PORT, HOST);
