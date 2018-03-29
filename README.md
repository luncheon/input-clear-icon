# input-clear-icon

An icon for clearing text appears on the focused &lt;input&gt;.

[Demo](https://luncheon.github.io/input-clear-icon/demo.html)

* No dependencies
* Lightweight (CSS + JS = about 2kB gzipped)
* Minimal side effects
* [Simplest usage](#usage)
* [Stylable](#styling)
  * Various icon stroke width

You can easily try it out with just adding the stylesheet and the script.

## Usage

### via CDN

1. Apply the stylesheet.
    ```html
    <!-- Select the stroke width of the icon from "thin", "extralight", "light", "regular", "medium", "semibold", "bold", "extrabold", "black".
         This is the case of "regular" stroke width. -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/input-clear-icon@0.1.0/input-clear-icon.regular.min.css">
    ```
2. Load the script.
    ```html
    <script src="https://cdn.jsdelivr.net/npm/input-clear-icon@0.1.0/input-clear-icon.min.js"></script>
    ```
3. Place input elements as usual.

### via npm

1. Install this package.
    ```bash
    $ npm install input-clear-icon
    ```
2. Bundle the stylesheet and the script.
    ```javascript
    import 'input-clear-icon/input-clear-icon.regular.css';
    import 'input-clear-icon/input-clear-icon.js';
    ```
3. Place input elements as usual.

## Styling

* "**input-clear-icon**" is the tag name of the clear icon that can be used as a CSS selector.
* "**data-input-clear-icon-class**" attribute of the input element is applied as the class name.
* "**data-input-clear-icon-style**" attribute of the input element is applied as the inline style.

See the [demo](https://luncheon.github.io/input-clear-icon/demo.html) for example.

## License

WTFPL
