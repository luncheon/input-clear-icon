# input-clear-icon

An icon for clearing text appears on the focused &lt;input&gt;.

[Demo](https://luncheon.github.io/input-clear-icon/demo.html)

* No dependencies
* Lightweight (CSS + JS = about 2kB gzipped)
* [Simplest usage](#usage)
* [Stylable](#styling)
* [Minimal side effects](#side-effects)

## Usage

### via CDN

1. Apply a stylesheet.
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/input-clear-icon/input-clear-icon.min.css">
    ```
2. Load a script.
    ```html
    <script src="https://cdn.jsdelivr.net/npm/input-clear-icon/input-clear-icon.min.js"></script>
    ```
3. Place input elements as usual.

### via npm

1. Install this package.
    ```bash
    $ npm install input-clear-icon
    ```
2. Import a stylesheet and a script.
    ```javascript
    import 'input-clear-icon/input-clear-icon.css';
    import 'input-clear-icon/input-clear-icon.js';
    ```
3. Place input elements as usual.

## Styling

* "**input-clear-icon**" is the tag name of the clear icon that can be used as a CSS selector.
* "**data-input-clear-icon-class**" attribute of the input element is applied as the class name.
* "**data-input-clear-icon-style**" attribute of the input element is applied as the inline style.

See the [demo](https://luncheon.github.io/input-clear-icon/demo.html) for example.

## Side effects

* JavaScript global object (the `window` object)
    * No side effects
* DOM
    * An icon element is appended into `document.body` once and shared. That has the tag name "input-clear-icon".
    * Following DOM events are captured on the `window`: "focus", "blur", "input". The event listener sets the style of the icon element (visibility, coordinate, etc).
* CSS [(Could See Source)](https://github.com/luncheon/input-clear-icon/blob/master/input-clear-icon.css)
    * Hide the browser native icon on the input element for clearing text.
        * Safari, Chrome, Opera: `<input type="search">`
        * Internet Explorer, Edge
    * A font-face with font-family name "input-clear-icon" is added.
        * [There is no fonts containing 'input-clear-icon' on Identifont.](http://www.identifont.com/find?font=input-clear-icon)
    * The style of the tag name "input-clear-icon" is set.
        * I want to believe that no one else has ever used this non-standard tag name.

## License

WTFPL
