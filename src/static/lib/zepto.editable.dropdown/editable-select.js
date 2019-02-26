(function($){
  $.fn.editableSelect = function(){
    new EditableSelect(this);

    return $(this);
  };

  var EditableSelect = function(holder){
    this.init(holder);
  };

  EditableSelect.prototype = {
    text: null,
    holder: null,
    init: function(holder) {
      var text = $("<input class='input-wide editable-input' type=text/>");
      holder.before(text);

      this.holder = $(holder).addClass('holder');
      this.text   = text;
      this.initInputEvents();
      this.pickItem();
    },

    initInputEvents: function(){
      parent = this;

      this.text.keyup(function(e){
        var strToMatch = this.value;
        var childs     = parent.holder.children();
        parent.holder.show();

        childs.each(function(){
          if($(this).text().toLowerCase().indexOf(strToMatch.toLowerCase()) > -1 ) {
            $(this).removeClass('ininvisible');
          } else {
            $(this).addClass('ininvisible');
          }
        });

        if (childs.length == $(".holder li.ininvisible").length) { parent.holder.hide(); }
      }).click(function(){
        parent.holder.show();
      });

      $("body").click(function(event) {
        if (!$(event.target).hasClass("editable-item") && !$(event.target).hasClass("editable-input")) {
          parent.holder.hide();
        }
      });
    },

    pickItem: function(){
      parent = this;

      $(parent.holder.children()).on('click', function(){
        parent.text.val($(this).text().trim());
        parent.holder.hide();
      });
    }
  }
})(window.Zepto || window.jQuery);