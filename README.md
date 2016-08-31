firefly_widgets
===============================

Firefly as Jupyter Widgets

**Note: these are experimental widgets lacking much of the planned functionality.**

Installation
------------

To install use pip (not ready yet):

    $ pip install firefly_widgets
    $ jupyter nbextension enable --py --sys-prefix firefly_widgets


For a development installation (requires npm),

    $ git clone https://github.com/Caltech-IPAC/firefly_widgets.git
    $ cd firefly_widgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --user firefly_widgets
    $ jupyter nbextension enable --py --user firefly_widgets

For further development:
 - Javascript side:
    - edit source in js/src
    - npm install in js/
 - Python side:
    - edit source

To remove:

    $ jupyter nbextension disable --py --sys-prefix firefly_widgets
    $ jupyter nbextension uninstall --py --sys-prefix firefly_widgets

