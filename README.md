firefly_widgets
===============================

Firefly as Widgets

Installation
------------

To install use pip:

    $ pip install firefly_widgets
    $ jupyter nbextension enable --py --sys-prefix pyfirefly


For a development installation (requires npm),

    $ git clone https://github.com/Caltech-IPAC/firefly_widgets.git
    $ cd firefly_widgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --user pyfirefly
    $ jupyter nbextension enable --py --user pyfirefly
