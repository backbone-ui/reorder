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

	var Reorder = View.extend({
		// default options
		el: ".ui-reorder",

		options: _.extend({}, View.prototype.options, {
			item : "li",
			monitor: ["drag", "touch"],
			hoverClass: "over",
			method: "inject", // options: swap, inject
			dataAttr: "order"
		}),

		events : _.extend({}, View.prototype.events, {

		}),

		oldEl: null,

		initialize: function(){
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
			return View.prototype.initialize.apply(this, arguments );
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

		// Internal methods
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
			$(this.el).find(this.options.item).attr("draggable", true);
		},

		_onDrag_Reorder: function( e ) {
			// move contents
			this.oldEl = e.target;
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
		},

		_onDragLeave_Reorder: function( e ) {
			// remove highlighted style
			var $el = $(e.target).closest( this.options.item );
			if( $el[0] === $(e.target)[0] ) $el.removeClass( this.options.hoverClass );
		},

		_onDrop_Reorder: function( e ){
			// remove highlighted style
			var $el = $(e.target).closest( this.options.item );
			$el.removeClass( this.options.hoverClass );
			// reorder elements
			if( _.isNull(this.data) ){
				this._Reorder_dom( e );
			} else {
				this._Reorder_data( e );
			}
		},

		_Reorder_dom: function( e ){
			var drag = parseInt( e.dataTransfer.getData('order') );
			var $el = $(e.target).closest( this.options.item );
			var drop = $el.index();
			switch( this.options.method ){
				case "swap":
					$(this.oldEl).html( $el.html() );
					$el.html( e.dataTransfer.getData('text/html') );
				break;
				case "inject":
					//$(this.oldEl).remove();
					if( drop > drag ){
						$el.after( $(this.oldEl) );
					} else {
						$el.before( $(this.oldEl) );
					}
				break;
			}
			// transmit order changed
			this.trigger("reorder", { start: drag, end: drop, type: this.options.method  });
		},

		_Reorder_data: function( e ){
			// it's expected that there's a data attribute for rendering
			var attr = this.options.dataAttr;
			var drag = parseInt( e.dataTransfer.getData('order') );
			var $el = $(e.target).closest( this.options.item );
			var drop = $el.index();
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

		_reorder_touchstart: function(){

		},

		_reorder_touchmove: function(){

		},

		_reorder_touchend: function(){

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