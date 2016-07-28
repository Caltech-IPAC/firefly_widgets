import ipywidgets as widgets
from traitlets import Unicode, Bool


@widgets.register('Image')
class ImageViewer(widgets.DOMWidget):
    """
    Image Viewer widget
    """
    _view_name = Unicode('ImageView').tag(sync=True)
    _view_module = Unicode('jupyter-firefly').tag(sync=True)
    GridOn = Bool(True).tag(sync=True)
    SurveyKey = Unicode('k').tag(sync=True)

