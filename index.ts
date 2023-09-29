const fastify = require('fastify')({
    logger: true
})
const path = require("path");

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fastify.register(require("@fastify/view"), {
    engine: {
      pug: require("pug")
    }
});


fastify.register(require("@fastify/static"), {
    root: path.join(__dirname,"public"),
    prefix: "/", // optional: default '/'
});


// Declare a route
fastify.get('/', function (request: any, reply: any) {
    reply.view('views/index.pug',{
        request: request
    })
})

fastify.listen({ port: 3000 }, function (err: any, address: any) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})