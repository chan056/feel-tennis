module.exports = function(){
    Vue.directive('draggable', {
        inserted: function (el, binding) {
            el = $(el);
            let startX;
            let startL;
            const rid = '.' + Math.random().toString().split('.')[1];

            let bindingValue = binding.value;
            let draggingSign = bindingValue.draggingSign;

            el.on('mousedown', function(e){
                startX =  e.clientX
                startL = tools.matchNumber(el.css('left'));
                draggingSign.status = true;
                let W = $(window);

                let maxL, minL;

                if(bindingValue.boundry){
                    maxL = bindingValue.boundry.max;
                    minL = bindingValue.boundry.min;
                }else{
                    maxL = bindingValue.max;
                    minL = bindingValue.min || 0;
                }

                W.on('mousemove' + rid, function(e){
                    let xDistance = e.clientX - startX;
                    let endL = startL + xDistance;

                    if(endL < minL){
                        endL = minL;
                    }else if (endL > maxL){
                        endL = maxL
                    }
                    
                    el.css({
                        'left': endL
                    })

                    if(bindingValue.draggingFn){
                        bindingValue.draggingFn(endL);
                    }
                })

                W.on('mouseup' + rid, function(){
                    W.off('mousemove' + rid).off('mouseup' + rid);
                    draggingSign.status = false;

                    if(bindingValue.mousupFuns){
                        bindingValue.mousupFuns.forEach(fn => {
                            fn && fn();
                            fn = null;
                        });
                    }
                })
            })
        }
    })
}