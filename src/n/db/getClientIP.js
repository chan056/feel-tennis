module.exports = {
    getClientIp: function (req) { 
        // request-ip
        var ipAddress;  
        var forwardedIpsStr = req.headers['x-forwarded-for'];   
        if (forwardedIpsStr) {  
            var forwardedIps = forwardedIpsStr.split(',');  
            ipAddress = forwardedIps[0];  
        }  
        if (!ipAddress) {  
            ipAddress = req.connection.remoteAddress;  
        }
        return ipAddress;  
    }
}