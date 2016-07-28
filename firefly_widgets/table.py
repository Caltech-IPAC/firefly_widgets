import ipywidgets as widgets
from traitlets import Unicode, Int
from astropy.table import Table
from six.moves.urllib.request import urlopen

@widgets.register('Table')
class TableViewer(widgets.DOMWidget):
    """
    Linked Table Viewer widget
    """
    _view_name = Unicode('TableView').tag(sync=True)
    _view_module = Unicode('jupyter-firefly').tag(sync=True)
    pageSize = Int(50).tag(sync=True)
    filters = Unicode().tag(sync=True)
    dataUrl = Unicode().tag(sync=True)
    def selection(self):
        """
        return the current filtered table as an astropy table
        """
        return(Table.read(urlopen(self.dataUrl).read().decode("utf-8"), format='ipac'))

