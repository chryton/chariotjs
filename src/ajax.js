if (window.$.fn || window.jQuery.fn){
	return $.ajax() || jQuery.fn
}

function nativeAjax() {
	// handle native XHR request
}

return nativeAjax;