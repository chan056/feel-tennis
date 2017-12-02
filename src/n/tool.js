function response404(response){
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    response.write("This request URL " + global.pathname + " was not found on this server.");
    response.end();
}

module.exports = {
    response404: response404
}