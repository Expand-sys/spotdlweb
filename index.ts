const fastify = require('fastify')({
    logger: false
})

const path = require("path");
const fs = require("fs")
const Spotify = require('spotifydl-core').default
const credentials = {
    clientId: process.env.clientID,
    clientSecret: process.env.clientSecret
}
const spotify = new Spotify(credentials)
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fastify.register(require("@fastify/view"), {
    engine: {
      pug: require("pug")
    }
});
fastify.register(require("fastify-socket.io"), {
    cors: {
        origin: "*:*",
        methods: ["GET", "POST"]
    }
})
fastify.register(require('@fastify/formbody'))
await fastify.register(require("@fastify/cors"), {
    origin: true
})

fastify.register(require("@fastify/static"), {
    root: path.join(__dirname,"public"),
    prefix: "/", // optional: default '/'
});


fastify.get('/', function (request: any, reply: any) {
    reply.view('views/index.pug',{
        request: request
    })
})


fastify.post('/download', function (request: any, reply: any) {
    reply.view('views/download.pug',{
        body: request.body
    })
})


fastify.ready((err) => {
    if (err) throw err;
  
  
    console.log("ready")

    fastify.io.on("connect", (socket:any) => {
        console.log("connected")
        socket.on("message", (socket:any) => {
            console.log("eans")
            console.log(socket)
        })
        socket.on("submit", async (socket:any) => {
            if(socket.option == "Single"){
                const details = await spotify.getTrack(socket.URL)
                console.log(details)
                const song = await spotify.downloadTrack(socket.URL)
                console.log(song)
                let filepath = path.join(__dirname,"public/download/${details.name}-${details.artists[0]}")
                fs.writeFileSync(filepath, song)
            }

        });
    })
    
});



fastify.io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});


fastify.listen({ port: 3000, host: "127.0.0.1" }, function (err: any, address: any) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})