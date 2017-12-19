let tools = {
    xhr: function xhr(api, sfn, type, params){
        type = type || 'get';
    
        axios[type](api, params)
        .then(function (response) {
           sfn && sfn(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    
    /**
     * [1,2] ['tag', 'innerHtml']
     * 文档中插入脚本
     */
    insertScriptTag: function(type, str, attrs){
        let script = document.createElement('script');
        for(let i in attrs){
            script[i] = attrs[i];
        }

        if(type == 1){
            script.setAttribute('src', str);
        }else if (type == 2) {
            script.innerHTML = str;
        }

        document.body.appendChild(script);
    }

    
};
