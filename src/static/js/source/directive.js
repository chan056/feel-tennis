module.exports = function(){
    Vue.directive('draggable', {
        inserted: function (el) {
            console.log()

            el = $(el);
            el.on('mousedown', function(){
                console.log('mousedown')
            })
            
            
            $(window).on('mousemove', function(){

            })
        }
    })
}