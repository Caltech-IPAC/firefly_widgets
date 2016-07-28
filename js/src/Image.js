var widgets = require('jupyter-js-widgets');
var _ = require('underscore');


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including `_model_name`, `_view_name`, `_model_module`
// and `_view_module` when different from the base class.
//
// When serialiazing entire widget state for embedding, only values different from the
// defaults will be specified.
var ImageModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _model_name : 'ImageModel',
        _view_name : 'ImageView',
        _model_module : 'jupyter-firefly',
        _view_module : 'jupyter-firefly',
        GridOn : true,
        SurveyKey : 'k'
    })
});

var seq = 1;
// Custom View. Renders the widget model.
var ImageView = widgets.DOMWidgetView.extend({
    render: function() {
        this.req = {
            plotId: 'xxq',
            Type      : 'SERVICE',
            Service   : 'TWOMASS',
            Title     : '2mass from service',
            GridOn     : true,
            SurveyKey  : 'k',
            WorldPt    : '10.68479;41.26906;EQ_J2000',
            SizeInDeg  : '.12',
            AllowImageSelection : true
        };
        this.el.id = `imageViewer-${seq++}`;
        this.model.on('change:GridOn change:SurveyKey', this.redraw, this);
        this.redraw = this.redraw.bind(this);
        setTimeout(this.redraw, 0);
    },

    redraw: function() {
        this.req.GridOn = this.model.get('GridOn');
        this.req.SurveyKey = this.model.get('SurveyKey');
        firefly.showImage(this.el.id, this.req);
    }
});


module.exports = {
    ImageModel : ImageModel,
    ImageView : ImageView
};
