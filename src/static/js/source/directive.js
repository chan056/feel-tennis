module.exports = function(){
    Vue.directive('draggable', {
        inserted: function (el) {
            el = $(el);
            let startX;
            el.on('mousedown', function(e){
                startX =  e.clientX
                startL = matchNumber(el.css('left'))
            })

            const rid = Math.random().toString().split('.')[1];
            
            $(window).on('mousemove' + rid, function(e){
                let xDistance = e.clientX - st.x;
                el.css({
                    'left': startX + xDistance
                })
            })

            $(window).on('mouseup' + rid, function(){

            })

            function matchNumber(str){
                return str.match(/\d+(\.\d+)?/)[0]
            }
        }
    })
}