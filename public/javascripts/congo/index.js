Congo = {
    init : function() {
        //router
        Congo.router = new Congo.Router();

        // data
        Congo.databases = new Congo.DatabaseCollection();
        Congo.currentCollection = new Congo.MongoCollections();
        
        // views
        Congo.breadcrumbs = new Congo.BreadcrumbView({ el: "#nav"});
        Congo.collectionLayout = new Congo.CollectionLayoutView({ collection: Congo.currentCollection });
        Congo.dbLayout = new Congo.DatabaseLayoutView({ collection: Congo.databases });

        Congo.appLayout = new Congo.AppLayout({
            el : "#app",
            detailRegion : "#details"
        })
    },

    start : function() {
        // initialize the app
        Congo.init();

        // for routing purposes
        Backbone.history.start();
    }
}

Congo.Router = Backbone.Router.extend({

    routes : {
        "" : "index",
        ":db" : "showDatabase"
    },

    showDatabase : function(db){
        Congo.currentDatabase = db;
        Congo.appLayout.renderDetails(Congo.collectionLayout);
        Congo.currentCollection.fetch();
    },
    
    index : function () {
        // Congo.dbLayout.render();
        // $("#details").empty();
        // $("#details").append(Congo.dbLayout.el);
        Congo.appLayout.renderDetails(Congo.dbLayout);
        Congo.databases.fetch();
    }
});
