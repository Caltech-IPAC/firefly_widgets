var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including `_model_name`, `_view_name`, `_model_module`
// and `_view_module` when different from the base class.
//
// When serializing entire widget state for embedding, only values different from the
// defaults will be specified.
var ImageModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'ImageModel',
        _view_name : 'ImageView',
        _model_module : 'jupyter-firefly',
        _view_module : 'jupyter-firefly',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0'
    })
});

//var util = firefly.util;
//var action = firefly.action;


// Custom View. Renders the widget model.
var ImageView = widgets.DOMWidgetView.extend({
    render: function() {
        this.url = this.model.get('url');
        this.el.id = this.model.get('plot_id');
        // disable Jupyter notebook keyboard manager
        // shortcut handling prevents input into dialog fields
        this.el.onclick = () => {
            Jupyter.keyboard_manager.disable();
        };
        this.model.set('conn_id', String(firefly.util.getWsConnId()));
        this.model.set('channel', String(firefly.util.getWsChannel()));
        this.touch();
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
        this.model.on('change:zoom', this.update_zoom, this);
        this.model.on('change:x_pan change:y_pan', this.update_pan, this);
        this.redraw = this.redraw.bind(this);
        this.update_color = this.update_color.bind(this);
        this.color_changed = this.color_changed.bind(this);
        this.colorListner = firefly.util.addActionListener(firefly.action.type.COLOR_CHANGE, this.color_changed);
        this.update_zoom = this.update_zoom.bind(this);
        this.zoom_changed = this.zoom_changed.bind(this);
        this.zoomListner = firefly.util.addActionListener(firefly.action.type.ZOOM_IMAGE, this.zoom_changed);
        this.update_pan = this.update_pan.bind(this);
        this.pan_changed = this.pan_changed.bind(this);
        this.stopPickListner = firefly.util.addActionListener(firefly.action.type.SELECT_POINT, this.pan_changed);
        //this.panListner = firefly.util.addActionListener(firefly.action.type.PROCESS_SCROLL, this.pan_changed);
        setTimeout(this.redraw, 0);
    },

    redraw: function() {
        this.req.GridOn = this.model.get('GridOn');
        this.req.SurveyKey = this.model.get('SurveyKey');
        this.req.WorldPt = this.model.get('WorldPt');
        this.req.SizeInDeg = this.model.get('SizeInDeg');
        if (this.hasOwnProperty("url") && (this.url.length === 0)) {
            firefly.showImage(this.model.get('plot_id'), this.req);
        }
        else {
            console.log('using url ' + this.url);
            firefly.showImage(this.el.id, {url: this.url, plotId: this.el.id});
        }
    },

    update_color: function() {
        console.log('updating color to ' + this.model.get('colorbar'));
        firefly.action.dispatchColorChange({plotId : this.el.id,
                                            cbarId : Number(this.model.get('colorbar')),
                                            actionScope : 'SINGLE'});
    },

    color_changed: function(action,state) {        // the callback for a color change
        if (action.payload.plotId === this.model.get('plot_id')) {
            var cbarId = Number(action.payload.primaryStateJson.colorTableId);
            var o_colorbar = Number(this.model.get('colorbar'));
            //var mymodel = this.model;
            console.log('I got a color change, colorbar = ' + cbarId);
            console.log('model colorbar = ' + o_colorbar);
            if (cbarId != o_colorbar){
                console.log('updating model colorbar to ' + cbarId);
                this.model.set('colorbar', cbarId);
                this.touch();
            }
        }
    },

    update_zoom: function() {
        console.log('updating zoom to ' + this.model.get('zoom'));
        firefly.action.dispatchZoom({plotId : this.model.get('plot_id'),
                                     userZoomType : 'LEVEL',
                                     level : this.model.get('zoom'),
                                     forceDelay : true });
    },

    zoom_changed: function(action,state) {        // the callback for a zoom change
        if (action.payload.plotId === this.model.get('plot_id')) {
            var plot= firefly.util.image.getPrimePlot( action.payload.plotId);  // get the plot
            console.log('I got a replot, zoom factor= ' + plot.zoomFactor);
            zoom_factor = Math.round(parseFloat(plot.zoomFactor)*100)/100;
            var o_zoom = Math.round(this.model.get('zoom')*100)/100;
            console.log('model zoom = ' + o_zoom);
            if (zoom_factor != o_zoom){
                console.log('updating model zoom to ' + zoom_factor);
                this.model.set('zoom', zoom_factor);
                this.touch();
            }
        }
     },

    update_pan: function() {
        console.log('updating x_pan, y_pan to ' +
                    this.model.get('x_pan') + ' ' + this.model.get('y_pan'));
        firefly.action.dispatchRecenter({plotId : this.model.get('plot_id'),
                                     centerPt : firefly.util.image.makeImagePt(
                                     Number(this.model.get('x_pan')),
                                     Number(this.model.get('y_pan')))});
    },

    pan_changed: function(action,state) {        // the callback for a zoom change
         console.log('I got a scroll processed');
        if (action.payload.plotId === this.model.get('plot_id')) {
            //var plot= firefly.util.image.getPrimePlot( action.payload.plotId);  // get the plot
            //const cc= firefly.util.image.CysConverter.make(plot);
            //const scrollToImagePt= cc.getImageCoords(
            //            firefly.util.image.makeScreenPt(plot.scrollX,plot.scrollY));
            var imagePt = String(action.payload.imagePt);
            var worldPt = String(action.payload.worldPt);
            console.log('imagePt is ' + imagePt);
            var data = imagePt.split(';');
            console.log('data[0] is ' + data[0]);
            console.log('data[1] is ' + data[1]);
            this.model.set('x_pan', Math.round(parseFloat(data[0])*100)/100);
            this.model.set('y_pan', Math.round(parseFloat(data[1])*100)/100);
            this.model.set('WorldPt', worldPt);
            this.touch();
        }
     }

});

module.exports = {
    ImageModel : ImageModel,
    ImageView : ImageView
};
