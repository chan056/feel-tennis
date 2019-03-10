(function ($) {
	$.fn.editableSelect = function (opts) {
		$(this).each(function (index, item) {
			new EditableSelect(item, opts);
		})

		return $(this);
	};

	var EditableSelect = function (holder, opts) {
		this.init(holder, opts);
	};

	EditableSelect.prototype = {
		text: null,
		holder: null,
		init: function (holder, opts) {
			holder = $(holder)
			var text = $("<input class='input-wide editable-input' type=text/>");
			holder.before(text);

			this.holder = holder.addClass('holder');
			this.text = text;
			this.initInputEvents();
			this.opts = opts;
			this.pickItem();
		},

		initInputEvents: function () {
			var _ = this;

			this.text.keyup(function (e) {
				var strToMatch = this.value;
				var childs = _.holder.children();
				_.holder.show();

				childs.each(function () {
					if ($(this).text().toLowerCase().indexOf(strToMatch.toLowerCase()) > -1) {
						$(this).removeClass('ininvisible');
					} else {
						$(this).addClass('ininvisible');
					}
				});

				if (childs.length == $(".holder li.ininvisible").length) { _.holder.hide(); }
			}).click(function () {
				this.holder.show();
			}.bind(this));

			$("body").click(function (event) {
				if (!$(event.target).hasClass("editable-item") && !$(event.target).hasClass("editable-input")) {
					this.holder.hide();
				}
			}.bind(this));
		},

		pickItem: function () {
			var _ = this;
			this.holder.on('click', 'li', function () {
				_.text.val($(this).text().trim());
				_.holder.hide();

				_.opts && _.opts.pickFunc && _.opts.pickFunc(this, _);
			});
		}
	}
})(window.Zepto || window.jQuery);