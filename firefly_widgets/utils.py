
from __future__ import print_function
from IPython.core.display import HTML
from IPython.display import display


def connect(tomcat_base='http://localhost:8080'):
    """
    tomcat_base: base URL for Tomcat server for Firefly; defaults to http://localhost:8080
    """
    fullstr = '<script src="{}/firefly/firefly_loader.js"></script>'.format(tomcat_base)
    display(HTML(fullstr))
