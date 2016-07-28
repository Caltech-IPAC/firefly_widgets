import ipywidgets as widgets
from traitlets import Unicode, Bool, Integer, TraitError, validate


@widgets.register('Image')
class ImageViewer(widgets.DOMWidget):
    """
    Image Viewer widget
    """
    _view_name = Unicode('ImageView').tag(sync=True)
    _view_module = Unicode('jupyter-firefly').tag(sync=True)
    GridOn = Bool(True).tag(sync=True)
    SurveyKey = Unicode('k').tag(sync=True)
    WorldPt = Unicode('10.68479;41.26906;EQ_J2000').tag(sync=True)
    SizeInDeg = Unicode('.12').tag(sync=True)
    url = Unicode('').tag(sync=True)
    colorbar = Integer(0).tag(sync=True)

    @validate('colorbar')
    def _valid_colorbar(self, proposal):
        colorbar = proposal['value']
        if colorbar not in range(22):
            raise TraitError('colorbar must be in range 0 to 21 inclusive')
        return proposal['value']