module.exports = function(){
    Vue.directive('draggable', {
        inserted: function (el, binding) {
            console.log(binding.value)
            el = $(el);
            let startX;
            let startL;
            const rid = '.' + Math.random().toString().split('.')[1];

            el.on('mousedown', function(e){
                startX =  e.clientX
                startL = matchNumber(el.css('left'));

                $(window).on('mousemove' + rid, function(e){
                    let xDistance = e.clientX - startX;
                    console.log('mousemove' + rid, startL + xDistance)
                    let endL = startL + xDistance;

                    if(binding.value.type == 'child'){
                        let maxL = el.parent().width();
                        if(endL<0)
                            endL = 0;
                        else if (endL > maxL)
                            endL = maxL
                    }

                    if(binding.value.fn){
                        binding.value.fn(endL);
                    }

                    el.css({
                        'left': endL
                    })
                })

                $(window).on('mouseup' + rid, function(){
                    $(window).off('mousemove' + rid).off('mouseup' + rid);
                })
            })

            function matchNumber(str){
                return Number(str.match(/\d+(\.\d+)?/)[0]) || 0
            }
        }
    })
}