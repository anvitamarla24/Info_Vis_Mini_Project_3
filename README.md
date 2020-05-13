# Info Vis Mini Project 3

## Running the code

Run one of the following commands in this directory:

```bash
# For Python 3:
python -m http.server

# For Python 2:
python -m SimpleHTTPServer
```

You can then go to http://localhost:8000 in your browser. See [How do you set up a local testing server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) for more.

## Contents

* `index.html` contains the basic HTML structure and links to the CSS and JS files.

* `style.css` contains CSS rules.

* `d3` contains the D3 library.

* `data` contains datasets used by the visualizations.  The file `countries.json` is a GeoJSON file for world countries which is derived from data from [Natural Earth](https://www.naturalearthdata.com).

* `main.js` loads the datasets and then calls the visualization functions.

* `visualizations` contains the code to make the visualizations.
