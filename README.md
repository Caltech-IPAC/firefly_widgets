firefly_widgets
===============================

Firefly Components as Jupyter Widgets

**Note: this repository contains experimental widgets for Jupyter notebook. This code is no longer maintained and is superceded by https://github.com/Caltech-IPAC/jupyter_firefly_extensions which works with Jupyterlab.**

Installation
------------

To install using pip (preferably after dependencies are installed with conda):

    $ pip install firefly_widgets
    $ jupyter nbextension enable --py --sys-prefix firefly_widgets


For a development installation (requires npm),

    $ git clone https://github.com/Caltech-IPAC/firefly_widgets.git
    $ cd firefly_widgets
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix firefly_widgets
    $ jupyter nbextension enable --py --sys-prefix firefly_widgets
    $ cd js
    $ npm install

When using the widgets, if a warning about missing widgetsnbextension appears, follow the instructions in the warning to install it. Installed nbextensions can be listed with:

    $ jupyter nbextension list

For further development:
 - Javascript side:
    - edit source in js/src
    - npm install in js/
 - Python side:
    - edit source

To remove these widgets:

    $ jupyter nbextension disable --py --sys-prefix firefly_widgets
    $ jupyter nbextension uninstall --py --sys-prefix firefly_widgets

