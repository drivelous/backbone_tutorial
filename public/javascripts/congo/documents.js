Congo.MongoDocument = Backbone.Model.extend({
	idAttribute : "_id",
	url : function() {
		var baseUrl = "/mongo-api/" + Congo.currentDatabase + "/" + Congo.selectedCollection;
		if (this.isNew()) {
			return baseUrl;
		} else {
			return baseUrl + "/" + this.id;
		}
	}
});

Congo.MongoDocuments = Backbone.Collection.extend({
	model: Congo.MongoDocument,
	url : function() {
		return "/mongo-api" + Congo.currentDatabase + "/" + Congo.selectedCollection;
	}
});

Congo.CollectionView = Congo.ItemView.extend({
	tagName: "tr",
	template: "#database-list-template",
	events: {
		"click button": "remove",
		"click a": "show"
	},

	show: function (ev) {
		ev.preventDefault();
		var collectionName = $(ev.currentTarget).data("collection");
		Congo.router.navigate(Congo.currentDatabase + "/" + collectionName, true);
	}
});

Congo.CollectionListView = Congo.ListView.extend({
	tagName: "table",
	className: "table table-striped",
	ItemView : Congo.CollectionView
});

Congo.CollectionOptionView = Congo.View.extend({
	initialize: function () {
		this.render();
	},
	template : "#new-collection-template",
	events: {
		"submit form": "addCollection"
	},
	addCollection: function (event) {
		event.preventDefault();
		var newCollectionName = $("#newCollection").val();
		var newCollection = new Congo.MongoCollection({ name: newCollectionName });
		newCollection.save();
		Congo.currentCollection.add(newCollection);
	}
});

Congo.DocumentLayoutView = Congo.Layout.extend({
	template: "#document-details-template",
	regions: {
		documentList: "#collection-list",
		documentOptions: "#collection-options"
	},
	layoutReady: function () {
		var documentListListView = new Congo.CollectionListView({ collection: this.collection });
		var optionView = new Congo.CollectionOptionView({});
		this.documentList.append(collectionListView.render().el);
		this.documentOptions.append(optionView.render().el);
	}
})