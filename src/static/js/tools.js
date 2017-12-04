function xhr(api, sfn, type, params){
    type = type || 'get';

	axios[type](api, params)
    .then(function (response) {
       sfn && sfn(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
}