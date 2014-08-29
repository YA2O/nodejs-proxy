(function () {
    "use strict";
    var http = require('http');
    var httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
    var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//

    var PORT = 9000;
    var TOGGLE_PORT = 9001;
    var toggle = true;

    http.createServer(function (req, res) {

        var forwardPort = toggle ? 8080 : 8090;


        // You can define here your custom logic to handle the request
        // and then proxy the request.

        console.log('-----Forwarding request to -------> Tomcat ' + (toggle ? '1' : '2') + ', port:  ' + forwardPort);
        printRequest(req);
        proxy.web(req, res, { target: 'http://127.0.0.1:' + forwardPort });
        req.on('error', function () {
            console.log(JSON.stringify(error));
        })
    }).listen(PORT);

    console.log("Listening on port " + PORT);

    http.createServer(function (req, resp) {
        toggle = !toggle;
        console.log("TOGGLING!!!");
        resp.writeHeader(200, {"Content-Type": "text/plain"});
        resp.write("Toggle activated");
        resp.end();
    }).listen(TOGGLE_PORT);

    console.log("To toggle, send a request to port " + TOGGLE_PORT);
})();

function printRequest(req) {
    console.log(req.method + " " + req.url);
    console.log("HEADERS :" + JSON.stringify(req.headers, true, 4));
    console.log("BODY : " + req.body);
}

//
//var http = require('http'),
//    console = require('console');
//
//http.createServer(onRequest).listen(9000);
//console.log("Proxy started... Listening to port " + 9000);
//
//function onRequest(client_req, client_res) {
//
//    console.log(">>>>> Request received :");
//    console.log("--->URL :" + client_req.url);
//    console.log("--->HEADERS :" + JSON.stringify(client_req.headers));
//    console.log("--->BODY : " + client_req.body);
//
//    var options = {
//        host: 'localhost',
//        port: 8080,
//        path: client_req.url,
//        method: 'GET'
//    };
//
//    var proxy = http.request(options, function (res) {
//        console.log("   <<<<<Response received");
//        console.log("   <---HEADERS :" + JSON.stringify(res.headers));
//        console.log("   <---BODY : " + res.body);
//        res.pipe(client_res, {
//            end: true
//        });
//    });
//
//    client_req.pipe(proxy, {
//        end: true
//    });
//}
