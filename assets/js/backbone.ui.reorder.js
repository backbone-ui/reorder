/* Backbone UI: Reorder
 * Source: https://github.com/backbone-ui/scrollchange
 * Copyright © Makesites.org
 *
 * Initiated by Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

(function($, _, Backbone, APP) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );
	var View = ( isAPP ) ? APP.View : Backbone.View;
	// this plugin depends on the mouse plugin
	if( typeof Backbone.Input == "undefined" || typeof Backbone.Input.Mouse == "undefined" ) return console.log("Backbone.Input.Mouse is a required dependency for this plugin");

	var Reorder = View.extend({
		// default options
		el: ".ui-reorder",

		options: _.extend({}, View.prototype.options, {
			item : "li",
			monitor: ["drag"],
			hoverClass: "over"
		}),

		events : _.extend({}, View.prototype.events, {

		}),

		oldEl: null,

		initialize: function(){
			var self = this;
			_.bindAll(this, "_onDrag_Reorder", "_onDragOver_Reorder", "_onDragEnter_Reorder", "_onDragLeave_Reorder", "_onDrop_Reorder", "_postRender_Reorder");
			//if( !isAPP ){
				// events
				this.on("drag", this._onDrag_Reorder);
				this.on("dragover", this._onDragOver_Reorder);
				this.on("dragenter", this._onDragEnter_Reorder);
				this.on("dragleave", this._onDragLeave_Reorder);
				this.on("drop", this._onDrop_Reorder);
				this.on("postRender", this._postRender_Reorder);
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

		_postRender_Reorder: function( e ){
			// add draggable attribute to items
			$(this.el).find(this.options.item).attr("draggable", true);
		},

		_onDrag_Reorder: function( e ) {
			// move contents
			this.oldEl = e.target;
			e.dataTransfer.setData('text/html', $(e.target).html() );
		},

		_onDragOver_Reorder: function( e ) {
			// add highlighted style
			//console.log("onDragOver", e );
		},

		_onDragEnter_Reorder: function( e ) {
			// add highlighted style
			$(e.target).addClass( this.options.hoverClass );
		},

		_onDragLeave_Reorder: function( e ) {
			// remove highlighted style
			$(e.target).removeClass( this.options.hoverClass );
		},

		_onDrop_Reorder: function( e ){
			// remove highlighted style
			$(e.target).removeClass( this.options.hoverClass );
			// reorder elements
			var el = e.dataTransfer.getData('el');
			$(this.oldEl).html( $(e.target).html() );
			$(e.target).html( e.dataTransfer.getData('text/html') );
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


})(this.jQuery, this._, this.Backbone, this.APP);