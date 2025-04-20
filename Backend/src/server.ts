import express from 'express';
import { endpoints } from './endpoints';

const port = normalizePort(process.env.PORT_WEBHOOK || '8000');

export function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
export function onListening(server: any) {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

export const createExpressApp:()=>{app:any, port: any} = () => {
    const server = express();
    server.set('port', port);
    server.use(express.json());
    server.use('/students', endpoints)


    return {app: server, port};
};

export function normalizePort(val: string) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}