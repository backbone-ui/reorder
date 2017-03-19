/* Backbone UI: Reorder
 * Source: https://github.com/backbone-ui/scrollchange
 * Copyright © Makesites.org
 *
 * Initiated by Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

(function(w, _, Backbone, APP) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );
	var View = ( isAPP ) ? APP.View : Backbone.View;
	var $ = w.jQuery || w.Zepto || w.$;
	// this plugin depends on the mouse plugin
	if( typeof Backbone.Input == "undefined" || typeof Backbone.Input.Mouse == "undefined" ) return console.log("Backbone.Input.Mouse is a required dependency for this plugin");

	// Shims
	// parent inheritance from Backbone.APP
	var parent=function(a,b){a=a||"",b=b||{},this.__inherit=this.__inherit||[];var c=this.__inherit[a]||this._parent||{},d=c.prototype||this.__proto__.constructor.__super__,e=d[a]||function(){delete this.__inherit[a]},f=b instanceof Array?b:[b];return this.__inherit[a]=d._parent||function(){},e.apply(this,f)};

	var Reorder = View.extend({
		// default options
		el: ".ui-reorder",

		options: _.extend({}, View.prototype.options, {
			item : "li",
			itemClass : "item",
			monitor: ["mouse"], // ["drag", "touch"],
			hoverClass: "over",
			method: "inject", // options: swap, inject
			dataAttr: "order"
		}),

		events : _.extend({}, View.prototype.events, {

		}),

		_dragEl: null,
		_clonedEl: null,

		initialize: function( options ){
			var self = this;
			_.bindAll(this, "_onDrag_Reorder", "_onDragOver_Reorder", "_onDragEnter_Reorder", "_onDragLeave_Reorder", "_onDrop_Reorder", "_preRender_Reorder", "_postRender_Reorder");
			// make sure there's a data object
			this.data = this.data || this.collection || null;
			if( !_.isNull( this.data ) ){
				// reorder based on the order attribute
				this._reorder();
			}
			//if( !isAPP ){
				// events
			// drag
				this.on("drag", this._onDrag_Reorder);
				this.on("dragover", this._onDragOver_Reorder);
				this.on("dragenter", this._onDragEnter_Reorder);
				this.on("dragleave", this._onDragLeave_Reorder);
				this.on("drop", this._onDrop_Reorder);
				this.on("preRender", this._preRender_Reorder);
				this.on("postRender", this._postRender_Reorder);
			// touch
				this.on("touchstart", this._reorder_touchstart);
				this.on("touchmove", this._reorder_touchmove);
				this.on("touchend", this._reorder_touchend);
			//}
			//

			//return View.prototype.initialize.apply(this, arguments );
			return this.parent('initialize', options);
		},

		render: function(){
			// add the plugin class in case it is missing
			$(this.el).addClass("ui-reorder");
			if( isAPP ) return View.prototype.render.apply(this, arguments );
			// by default trigger related events
			this.trigger("preRender");
			this.trigger("render");
			this.trigger("postRender");
		},

		add: function( el ){
			console.log(this.el, el);
			$(this.el).append(el);
			// post-render
			this.trigger("postRender");
		},

		// Events

		// event after
		onReorder: function(){

		},

		onDragIn: function(){

		},

		onDragOut: function(){

		},

		onDrop: function(){

		},

		// returns the dragged element
		getDragEl: function(){
			return this._dragEl;
		},

		// deletes the dragged element
		delDragEl: function(){
			$(this._dragEl).remove();
		},

		// Helpers

		// call methods from the parent
		parent: View.prototype.parent || parent,

		// Internal

		_reorder: function(){
			var attr = this.options.dataAttr;
			if( _.isUndefined(this.data.comparator) ){
				this.data.comparator = function(model) {
					return model.get(attr);
				}
			}
			this.data.sort({silent: true});
		},

		_preRender_Reorder: function( e ){

		},

		_postRender_Reorder: function( e ){
			// add draggable attribute to items
			var $el = $(this.el).find(this.options.item);
			$el.attr("draggable", true);
			$el.addClass( this.options.itemClass );
			$el.addClass( "ui-reorder-item" );
		},

		_onDrag_Reorder: function( e ) {
			// move contents
			this._dragEl = e.target;
			if( _.isNull(this.data) ){
				e.dataTransfer.setData('text/html', $(e.target).html() );
			}
			e.dataTransfer.setData('order', $(e.target).index() );
		},

		_onDragOver_Reorder: function( e ) {
			// add highlighted style
			//console.log("onDragOver", e );
		},

		_onDragEnter_Reorder: function( e ) {
			// add highlighted style
			var $el = $(e.target).closest( this.options.item );
			$el.addClass( this.options.hoverClass ).siblings(this.options.item).removeClass( this.options.hoverClass );
			// user actions
			this.onDragIn(e);
		},

		_onDragLeave_Reorder: function( e ) {
			// remove highlighted style
			var $el = $(e.target).closest( this.options.item );
			if( $el[0] === $(e.target)[0] ) $el.removeClass( this.options.hoverClass );
			// user actions
			this.onDragOut(e);
		},

		_onDrop_Reorder: function( e ){
			// remove highlighted style
			var $drop = $(e.target).closest( this.options.item );
			var $drag = $(this._dragEl);
			$drop.removeClass( this.options.hoverClass );
			// reorder elements
			if( _.isNull(this.data) ){
				this._Reorder_dom( $drag, $drop );
			} else {
				this._Reorder_data( $drag, $drop );
			}
			// user actions
			this.onDrop(e);
		},

		_Reorder_dom: function( $drag, $drop){
			//var drag = parseInt( e.dataTransfer.getData('order') );
			var drag = $drag.index();
			var drop = $drop.index();
			switch( this.options.method ){
				case "swap":
					var html = $drag.html();
					$drag.html( $drop.html() );
					//$drop.html( e.dataTransfer.getData('text/html') );
					$drop.html( html );
				break;
				case "inject":
					//$(this._dragEl).remove();
					if( drop > drag ){
						$drop.after( $drag );
					} else {
						$drop.before( $drag );
					}
				break;
			}
			// transmit order changed
			var params = { start: drag, end: drop, type: this.options.method  };
			this.trigger("reorder", params);
			// user actions
			this.onReorder(params);
		},

		_Reorder_data: function( $drag, $drop ){
			// it's expected that there's a data attribute for rendering
			var attr = this.options.dataAttr;
			//var drag = parseInt( e.dataTransfer.getData('order') );
			var drag = $drag.index();
			var drop = $drop.index();
			//
			switch( this.options.method ){
				case "swap":
					// assuming ordering stars from 1 (not zero)
					this.data.at(drag).set( attr, drop+1 );
					this.data.at(drop).set( attr, drag+1 );
				break;
				case "inject":
					this.data.at(drag).set( attr, drop+1 );

					this.data.each(function( item, i ){
						if( i == drag ) return;
						var value = item.get( attr );
						// normalize order value to start from zero
						var order = value-1;
						if( order >= drop && order < drag ){
							// pushes all elements by one (under it)
							item.set( attr, value+1 );
						} else if( order >= drag && order <= drop ){
							item.set( attr, value-1 );
						}
					});
				break;
			}
			// sort data
			this._reorder();
			// re-render the views
			this.render();
		},

		_reorder_touchstart: function( e ){

		},

		_reorder_getEl: function( e ){
			// put this in the touch plugin
			if (e.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				var coords = {
					left: touch.pageX,
					top: touch.pageY
				}
				//console.log( coords );
			}
			// find the element closest to the coords
			var el = this._touch_findEl( this.options.item, coords );
			if( el ){
				this._dragEl = el;
				// clone element
				this._clonedEl = $( el ).clone().appendTo(this.el);
				// separate the cloned element from the rest
				this._clonedEl.removeClass( "ui-reorder-item" );
				// get position relative to the parent
				var pos = $(el).position();
				this._clonedEl.css({ position: "absolute", top: pos.top, left: pos.left });
			}
			// save original position
			this.coords_touch = coords;

		},

		_reorder_touchmove: function( e ){
			// on first move, get the element
			if( _.isNull(this._clonedEl) ) this._reorder_getEl( e );
			// get latest coords
			if (e.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				var coords = {
					left: touch.pageX,
					top: touch.pageY
				}
				//console.log( coords );
			}
			// update position of cloned el
			if( this._clonedEl ){
				var $clone = $(this._clonedEl);
				var left = parseInt($clone.css("left")) + (coords.left - this.coords_touch.left);
				var top = parseInt($clone.css("top")) + (coords.top - this.coords_touch.top);
				$clone.css({ top: top, left: left });
			}
			// save coords for next event
			this.coords_touch = coords;
			var el = this._touch_findEl( ".ui-reorder-item", coords );
			// mimic a dragleave event...
			$(el).addClass( this.options.hoverClass ).siblings( ".ui-reorder-item" ).removeClass( this.options.hoverClass );
		},

		_reorder_touchend: function(){
			// remove cloned element
			$(this._clonedEl).remove();
			this._clonedEl = null;
			var $drag = $(this._dragEl);
			// the one with the hover class is assumed the drop target
			var $drop = $(this.el).find( this.options.item ).filter( "."+ this.options.hoverClass );
			// remove styling
			$drop.removeClass( this.options.hoverClass );
			// reorder elements
			if( _.isNull(this.data) ){
				this._Reorder_dom( $drag, $drop );
			} else {
				this._Reorder_data( $drag, $drop );
			}
		}

	});

	// fallbacks
	if( _.isUndefined( Backbone.UI ) ) Backbone.UI = {};
	Backbone.UI.Reorder = Reorder;

	// Support module loaders
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = Reorder;
	} else {
		// Register as a named AMD module, used in Require.js
		if ( typeof define === "function" && define.amd ) {
			//define( "backbone.ui.scrollchange", [], function () { return Reorder; } );
			//define( ['jquery', 'underscore', 'backbone'], function () { return Reorder; } );
			define( [], function () { return Reorder; } );
		}
	}
	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.Backbone = Backbone;
		// update APP namespace
		if( typeof APP != "undefined" && (_.isUndefined( APP.UI ) || _.isUndefined( APP.UI.Reorder ) ) ){
			APP.UI = APP.UI || {};
			APP.UI.Reorder = Backbone.UI.Reorder;
			window.APP = APP;
		}
	}


})(this.window, this._, this.Backbone, this.APP);
