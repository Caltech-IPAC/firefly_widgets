
from __future__ import print_function
from IPython.core.display import HTML
from IPython.display import display


def connect(server_url='http://localhost:8080/firefly'):
    """Load Firefly javascript into the DOM

    Parameters:
    ----------
    server_url : `str`
       base URL for Firefly server Firefly
       defaults to http://localhost:8080/firefly
    """
    fullstr = '<script src="{}/firefly_loader.js"></script>'.format(server_url)
    display(HTML(fullstr))
