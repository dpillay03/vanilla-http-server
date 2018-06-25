'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const cowsay = require('cowsay');
const bodyParse = require('./lib/body-parse.js');
const PORT = process.ENV || 3000;

const server = http.createServer(function (req, res) {
    req.url = url.parse(req.url);
    req.url.query = querystring.parse(req.url.query);
    console.log('url: ', req.url);

    if (req.method === 'GET' && req.url.pathname === '/') {
        handleGet(res);
    }

    else if (req.method === 'GET' && req.url.pathname === '/cowsay') {
        cowsayGet(res);
    }
    
    else if (req.method === 'POST' && req.url.pathname === '/api/cowsay') {
        cowsayPost(req, res)
    }else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.write('Invalid file path' + req.url.pathname);
        res.end();
    }
});

function handleGet(res) {
    fs.readFile('index.html', (err, data) => {
        if(err) {
            res.writeHead(404, { 'Content-Type': 'text/plain '});
            res.end();
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data.toString());
        res.end();
    });
}

function cowsayGet(res) {
    res.write(cowsay.say( { text: 'Hello, my name is Sir Loin' }));
    res.end();
}

function cowsayPost(req, res) {
    bodyParse(req, function (err, body){
        if(err) {
            return console.log(err);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let cowText = cowsay.say({ text: body.text});
        let json = JSON.stringify({ content: cowText });
        res.write(json);
        res.end();
    });
}

server.listen(PORT, () => {
    console.log(`Your port is on http://localhost:${PORT}`);
});