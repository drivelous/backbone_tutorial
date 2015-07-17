Congo.MongoDocument = Backbone.Model.extend({
	idAttribute : "_id",
	url : function() {
		var baseUrl = "/mongo-api/" + Congo.currentDatabase + "/" + Congo.selectedCollection;
		if (this.isNew()) {
			return baseUrl;
		} else {
			return baseUrl + "/" + this.id;
		}
	},

	descriptor: function () {
		if(this.get("name"))
			return this.get("name");
		if(this.get("sku"))
			return this.get("sku");
		if(this.get("slug"))
			return this.get("slug");
		else if(this.get("title"))
			return this.get("title");
		else if(this.get("email"))
			return this.get("email");
		else
			return this.get("_id");
	}
});

Congo.MongoDocuments = Backbone.Collection.extend({
	model: Congo.MongoDocument,
	url : function() {
		return "/mongo-api/" + Congo.currentDatabase + "/" + Congo.selectedCollection;
	}
});

Congo.DocumentView = Congo.ItemView.extend({
	tagName: "tr",
	template: "#document-list-template",
	events: {
		"click button": "remove",
		"click a": "show"
	},

	show: function (ev) {
		ev.preventDefault();
		var collectionName = $(ev.currentTarget).data("collection");
		Congo.router.navigate(Congo.currentDatabase + "/" + collectionName, true);
	},

	render: function () {
		var source = $(this.template).html();
		var data = {descriptor: this.model.descriptor()};
		var compiled = _.template(source, data);
		this.$el.html(compiled);
		return this
	}
});

Congo.DocumentListView = Congo.ListView.extend({
	tagName: "ul",
	className: "thumbnails",
	ItemView : Congo.DocumentView
});

Congo.DocumentOptionView = Congo.View.extend({
	initialize: function () {
		this.render();
	},
	template : "#new-document-template",
	events: {
		"submit form": "addDocument"
	},

	addDocument: function (event) {
		event.preventDefault();
		Congo.navDocument("new");
	}
});

Congo.DocumentLayoutView = Congo.Layout.extend({
	template: "#document-details-template",
	regions: {
		documentList: "#document-list",
		documentOptions: "#document-options"
	},
	layoutReady: function () {
		var documentListListView = new Congo.CollectionListView({ collection: this.collection });
		var optionView = new Congo.DocumentOptionView({});
		this.documentList.append(documentListListView.render().el);
		this.documentOptions.append(optionView.render().el);
	}
})