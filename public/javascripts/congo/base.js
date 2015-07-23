Congo.View = Backbone.View.extend({
	render: function() {
        var source = $(this.template).html();
        var data = {};
        if (this.model)
        	data = this.model.toJSON();
        var compiled = _.template(source, data);
        this.$el.html(compiled);
        return this;
    }
});

Congo.ItemView = Congo.View.extend({
	remove: function() {
		var confirmed = confirm("Delete it? You're effing nuts!");
		if (confirmed) {
			this.model.destroy();
		}
	}
});

Congo.ListView = Backbone.View.extend({
    initialize : function() {
        this.collection.bind("add", this.render, this);
        this.collection.bind("reset", this.render, this);
        this.collection.bind("remove", this.render, this);
    },

    render : function() {
    	var self = this;
        var els = [];
        this.collection.each(function (item) {
        	var itemView = new self.ItemView({ model: item});
            els.push(itemView.render().el);
        });
        this.$el.html(els);
        return this;
    }
});

Congo.Layout = Backbone.View.extend({

	render : function() {

		this.$el.empty();

		// add the details template to the dom
		var templateSource = $(this.template).html();
		this.$el.append(_.template(templateSource));

		var self = this;

		// loop the regions and make them available on this
		_.each(this.regions, function (selector, name) {
			// explicitly declare each region as a jQuery selector
			// scoped to this view
			self[name]=self.$(selector);
		});

		//now, emit an event that says the DOM template is loaded
		//and that we have explicit jquery objects set for regions
		if (self.layoutReady) self.layoutReady();

		return self;
	}
});

Congo.AppLayout = Backbone.View.extend({
	hideEverything : function() {
		this.$(this.ooptions.detailRegion).empty();
		this.$(this.options.editorRegion).hide();
	},

	renderEditor : function(thing) {
		this.hideEverything();
		var docJSON = JSON.stringify(this, null, ' ');
		// render out the ace editor

		this.$(this.options.editorRegion).show();
		this.$(this.options.editorRegion).show();
		var editor = ace.edit("ace-editor");
		var JsonMode = require("ace/mode/json").Mode;
		editor.getSession().setMode(new JsonMode());
		editor.setValue(docJSON);
		editor.selection.clearSelection();
	},

	initialize: function() {
		this.renderNavigator();
	},

	renderNavigator : function() {
		this.options.navigatorView.render();
	},

	renderDetails : function(detailView) {
		//pass the region in on init
		$("#editor").hide();
		this.$(this.options.detailRegion).empty();
		detailView.render();
		this.$(this.options.detailRegion).append(detailView.el);
	}
});
