# Backbone UI: Reorder

Update the order of dom elements on mouse drag, using HTML5's Drag n' Drop API

## Install

Using bower:
```
bower install backbone.ui.reorder
```

## Dependencies

* [Backbone](http://backbonejs.org/)
* [Underscore](http://underscorejs.org/)
* [Backbone Input: Mouse](http://github.com/backbone-input/mouse)

Note that the plugin uses APP.View from [Backbone APP](http://github.com/makesites/backbone-app) if available, but falls back gracefully if you prefer using custom render logic.


## Usage

```
var view = new Backbone.UI.Reorder({
		el : "#menu"
});
view.render();
```


## Options

A more detailed list of all the available options.

* ***item***: selector for the individual item - default: "li"
* ***method***: how to treat the drop event, either swaping or injecting the position of the element  - default: "li"
* ***hoverClass***: the class assigner to the items the dragged element is hovering ver - default: over


## Examples

* [Static example](http://rawgithub.com/backbone-ui/reorder/master/examples/static.html)


## Credits

Initiated by Makis Tracend ( [@tracend](http://github.com/tracend) )

Distributed through [Makesites.org](http://makesites.org/)

Released under the [MIT license](http://makesites.org/licenses/MIT)

