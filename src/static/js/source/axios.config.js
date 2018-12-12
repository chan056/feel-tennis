axios.interceptors.response.use(function (response) {
	// Do something with response data
	console.log(response)
	// 将“链接”全部加上远程域名 TODO
	// 自己构造的连接 比如封面？
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});