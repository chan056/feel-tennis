function xhr(api, sfn){
	axios.get(api)
    .then(function (response) {
			sfn && sfn(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
}