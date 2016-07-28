var widgets = require('jupyter-js-widgets');
var _ = require('underscore');


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including `_model_name`, `_view_name`, `_model_module`
// and `_view_module` when different from the base class.
//
// When serialiazing entire widget state for embedding, only values different from the
// defaults will be specified.
var TableModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _model_name : 'TableModel',
        _view_name : 'TableView',
        _model_module : 'jupyter-firefly',
        _view_module : 'jupyter-firefly',
        pageSize : 50,
        filters : ''
    })
});

var seq = 1;

// Custom View. Renders the widget model.
var TableView = widgets.DOMWidgetView.extend({
    render: function() {
        this.req = firefly.util.table.makeIrsaCatalogRequest('wise_allwise_p3as_psd', 'WISE', 'wise_allwise_p3as_psd',
            {   position: '10.68479;41.26906;EQ_J2000',
                SearchMethod: 'Cone',
                radius: 300
            });
        this.el.id = `TableViewer-${seq++}`;
        this.model.on('change:pageSize change:filters', this.redraw, this);
        this.redraw = this.redraw.bind(this);
        this.tableUpdated = this.tableUpdated.bind(this);
        this.removeListner = firefly.util.addActionListener(['table.new','table.sort','tableUi.update'], this.tableUpdated);
        setTimeout(this.redraw, 0);
    },

    redraw: function() {
        this.req.pageSize = this.model.get('pageSize');
        this.req.filters = this.model.get('filters');
        firefly.showTable(this.el.id, this.req);
    },

    tableUpdated: function(action, state) {
        var dataUrl = firefly.util.table.getTableSourceUrl(
                        firefly.util.table.getTableUiByTblId(this.req.tbl_id));
        this.model.set('dataUrl', dataUrl);
        if (action.payload.tbl_id === this.req.tbl_id) {
            var o_filters = this.model.get('filters');
            var n_filters = action.payload.request.filters;
            if (o_filters != n_filters) {
//                 this.model.set('filters', n_filters);
            }
        }
        this.touch();
    }
});


module.exports = {
    TableModel : TableModel,
    TableView : TableView
};
