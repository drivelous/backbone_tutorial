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
})