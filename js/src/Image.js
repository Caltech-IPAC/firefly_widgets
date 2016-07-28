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
        _view_module : 'jupyter-firefly'
    })
});

var seq = 1;
// Custom View. Renders the widget model.
var ImageView = widgets.DOMWidgetView.extend({
    render: function() {
        this.url = this.model.get('url');
        this.el.id = `imageViewer-${seq++}`;
        this.req = {
            plotId    : this.el.id,
            Type      : 'SERVICE',
            Service   : 'TWOMASS',
            Title     : '2mass from service',
            GridOn     : true,
            SurveyKey  : 'k',
            WorldPt    : '10.68479;41.26906;EQ_J2000',
            SizeInDeg  : '.12',
            AllowImageSelection : true
        };
        this.model.on('change:GridOn change:SurveyKey change:FilePath', this.redraw, this);
        this.model.on('change:colorbar', this.update_color, this);
        this.redraw = this.redraw.bind(this);
        this.update_color = this.update_color.bind(this);
        setTimeout(this.redraw, 0);
        setTimeout(this.update_color, 0);
    },

    redraw: function() {
        this.req.GridOn = this.model.get('GridOn');
        this.req.SurveyKey = this.model.get('SurveyKey');
        this.req.WorldPt = this.model.get('WorldPt');
        this.req.SizeInDeg = this.model.get('SizeInDeg');
        if (this.url.length === 0) {
            firefly.showImage(this.el.id, this.req);
        }
        else {
            firefly.showImage(this.el.id, {url: this.url, plotId: this.el.id});
        }
    },

    update_color: function() {
        firefly.action.dispatchColorChange({plotId : this.el.id, cbarId : this.model.get('colorbar')});
    }
        
});

module.exports = {
    ImageModel : ImageModel,
    ImageView : ImageView
};
