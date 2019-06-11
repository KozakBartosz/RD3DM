


/*!
 * Cookies.js - 0.3.1;
 * Copyright (c) 2013, Scott Hamper; http://www.opensource.org/licenses/MIT
 * https://github.com/ScottHamper/Cookies
 *
 * Cookies.set('key', 'value');
 * Cookies.get('key');
 */
(function(e){"use strict";var a=function(b,d,c){return 1===arguments.length?a.get(b):a.set(b,d,c)};a._document=document;a._navigator=navigator;a.defaults={path:"/"};a.get=function(b){a._cachedDocumentCookie!==a._document.cookie&&a._renewCache();return a._cache[b]};a.set=function(b,d,c){c=a._getExtendedOptions(c);c.expires=a._getExpiresDate(d===e?-1:c.expires);a._document.cookie=a._generateCookieString(b,d,c);return a};a.expire=function(b,d){return a.set(b,e,d)};a._getExtendedOptions=function(b){return{path:b&&b.path||a.defaults.path,domain:b&&b.domain||a.defaults.domain,expires:b&&b.expires||a.defaults.expires,secure:b&&b.secure!==e?b.secure:a.defaults.secure}};a._isValidDate=function(b){return"[object Date]"===Object.prototype.toString.call(b)&&!isNaN(b.getTime())};a._getExpiresDate=function(b,d){d=d||new Date;switch(typeof b){case "number":b=new Date(d.getTime()+1E3*b);break;case "string":b=new Date(b)}if(b&&!a._isValidDate(b))throw Error("`expires` parameter cannot be converted to a valid Date instance");return b};a._generateCookieString=function(b,a,c){b=encodeURIComponent(b);a=(a+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};b=b+"="+a+(c.path?";path="+c.path:"");b+=c.domain?";domain="+c.domain:"";b+=c.expires?";expires="+c.expires.toUTCString():"";return b+=c.secure?";secure":""};a._getCookieObjectFromString=function(b){var d={};b=b?b.split("; "):[];for(var c=0;c<b.length;c++){var f=a._getKeyValuePairFromCookieString(b[c]);d[f.key]===e&&(d[f.key]=f.value)}return d};a._getKeyValuePairFromCookieString=function(b){var a=b.indexOf("="),a=0>a?b.length:a;return{key:decodeURIComponent(b.substr(0,a)),value:decodeURIComponent(b.substr(a+1))}};a._renewCache=function(){a._cache=a._getCookieObjectFromString(a._document.cookie);a._cachedDocumentCookie=a._document.cookie};a._areEnabled=function(){return a._navigator.cookieEnabled||"1"===a.set("cookies.js",1).get("cookies.js")};a.enabled=a._areEnabled();"function"===typeof define&&define.amd?define(function(){return a}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=a),exports.Cookies=a):window.Cookies=a})();

/*!
 * imagesLoaded PACKAGED v3.0.4
 * JavaScript is all like "You images are done yet or what?"
 */

/*!
* qTip2 v2.2.0 - qtip2.com
* Copyright 2009-2010 Craig Michael Thompson
* Date: Fri Nov 29 2013 13:08:39
*/

/*!
 * Magnific Popup
 * Version 0.9.9
 * http://bit.ly/magnific-popup#build=inline+image+ajax+iframe+gallery+imagezoom+fastclick
 * by Dmitry Semenov
 */

/*!
 * Valider - HTML5 Form Validation
 * @author Kacper Kozak
 * @version 1.1.0
 * @license MIT
 */

/*
 * Format numbers
 * (5220.53).toMonay() -> "5 220,53"
 */
Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep)
{
	var n = this,
	c = isNaN(decimals) ? 2 : Math.abs(decimals),
	d = decimal_sep || ',',
	t = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
	sign = (n < 0) ? '-' : '',
	i = parseInt(n = Math.abs(n).toFixed(c)) + '',
	j = ((j = i.length) > 3) ? j % 3 : 0;
	return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};

/*
 * Preloading
 */
/*
 * Trim jak w PHP
 */

/*
 * Czyta konfigurację
 */

(function($){
	/*
	 * serializeForm - Serialize form inputs to object
	 */
	$.fn.serializeForm = function(){
		var json = {};
		jQuery.map($(this).serializeArray(), function(n, i){
			json[n['name']] = n['value'];
		});
		return json;
	};

	/*
	 * dataConfig - konfuguracja z atrybutu data-*
	 */
	$.fn.dataConfig = function(name, def){
		var data = $(this).data(name);
		return readConfig(data, def);
	};

	/*
	 * CSS3 Animation End
	 */
	var animationEndEvents = "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd transitionend webkitTransitionEAnind oTransitionEnd MSTransitionEnd";
	$.fn.onAnimationEnd = function(cb) {
		return this.each(function(){
			$(this).on(animationEndEvents, function() {
				if (typeof cb == 'function') cb.call(this);
			});
		});
	};
	$.fn.offAnimationEnd = function() {
		return this.each(function(){
			$(this).off(animationEndEvents);
		});
	};

})(jQuery);


export default jQuery