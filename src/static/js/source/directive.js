module.exports = function(){
    Vue.directive('draggable', {
        inserted: function (el, binding) {
            // console.log(binding.value)
            el = $(el);
            let startX;
            let startL;
            const rid = '.' + Math.random().toString().split('.')[1];

            console.log(binding.value)

            el.on('mousedown', function(e){
                startX =  e.clientX
                startL = tools.matchNumber(el.css('left'));

                let maxL, minL;

                if(binding.value.boundry){
                    maxL = binding.value.boundry.max;
                    minL = binding.value.boundry.min;
                }else{
                    maxL = binding.value.max;
                    minL = binding.value.min || 0;
                }

                $(window).on('mousemove' + rid, function(e){
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

                    if(binding.value.fn){
                        binding.value.fn(endL);
                    }
                })

                $(window).on('mouseup' + rid, function(){
                    $(window).off('mousemove' + rid).off('mouseup' + rid);
                })
            })
        }
    })
}