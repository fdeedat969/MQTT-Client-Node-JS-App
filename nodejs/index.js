const http = require("http");
const fs = require("fs");
var url = require("url");
const host = '192.168.39.226';
const port = 8080;

const requestListener = function(request,response){
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");

	response.writeHead(200);

	if(pathname == "/") {
		html = fs.readFileSync("index.html", "utf8");
		response.write(html);
	} else if (pathname == "/script.js") {
		script = fs.readFileSync("script.js", "utf8");
		response.write(script);
	}


	response.end();
}

const server = http.createServer(requestListener);

server.listen(port,host,() =>{
	console.log(`Server is running on http://${host}:${port}`);
});