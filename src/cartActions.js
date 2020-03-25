import ajax from 'ajax';
import cartQueue from 'queue';

let Chariot = Chariot || {};

Chariot.cart = Chariot.cart || {};

Chariot.cart.api = (function (Chariot) {

	/**
	 *Generic AJAX request function
	 *
	 * @param {string} path URL/Path to call
	 * @param {string} verb XHR verb; usually "GET" or "POST"
	 * @param {function} callback Function to call when request is complete
	 * @param {object} callData Data to send with the request
	 */
	function callShopify(path, verb, callback, callData) {
		let returnType = path.indexOf('view=') > -1 ? 'text html' : 'json';

		ajax({
			url: path,
			dataType: returnType,
			type: verb,
			cache: false,
			data: callData
		})
			.done(function (res) {
				if (returnType === 'text html') {
					res = JSON.parse(res);
				}

				if (typeof callback === 'function') {
					callback(res);
				}
			})
			.fail(function (res) {
				console.error(res.responseJSON);
			});
	}

	/**
	 * Fetches the cart
	 * https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart
	 *
	 * @param {cartCallback} callback Function to call after the cart is fetched
	 * @param {boolean=} useDefault (Optional) Toggles use of the built in cart JSON view or our custom one
	 */
	function getCart(callback, useDefault) {
		let cartPath = useDefault === true ? '/cart.json' : '/cart?view=api';

		callShopify(cartPath, 'GET', callback);
	}

	/**
	 * Clears the cart of all items and fires a callback
	 * https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#clear-cart
	 *
	 * @param {cartCallback} callback Function to call when clear is complete
	 */
	function clearCart(callback) {
		callShopify('/cart/clear.json', 'POST', callback);
	}

	/**
	 * Adds a single item to the cart
	 * https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart
	 *
	 * @param {object} data Add to cart data; at least variant ID and quantity
	 * @param {cartCallback} callback Function to call when add to cart is complete
	 */
	function addToCart(data, callback) {
		callShopify('/cart/add.js', 'POST', callback, data);
	}

	/**
	 * Removes an item from the cart
	 *
	 * @param {object} data Accepts variant ID, line item key, or line item index
	 * @param {cartCallback} callback Function to call when removal is complete
	 */
	function removeFromCart(data, callback) {
		let removedItem = Object.assign(data, { quantity: 0 });

		callShopify('/cart/change.js', 'POST', callback, removedItem);
	}

	/**
	 * Updates one or multiple items in the cart.
	 * Preference is given to using line item keys over index or variant ID.
	 * https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#update-cart
	 *
	 * @param {(object|string)} data Line items to update. Will accept any format that `/cart/update.js` accepts.
	 * @param {cartCallback} callback Function to call when the update is complete
	 */
	function updateCart(data, callback) {
		callShopify('/cart/update.js', 'POST', callback, data);
	}

	/**
	 * Changes a single line item in the cart
	 * https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#change-cart
	 *
	 * @param {object} data Line item to update; line item key, line index, or variant id
	 * @param {cartCallback} callback Function to call when the change is complete
	 */
	function changeCart(data, callback) {
		callShopify('/cart/change.js', 'POST', callback, data);
	}

	return {
		fetch: getCart,
		get: getCart,
		clear: clearCart,
		add: addToCart,
		remove: removeFromCart,
		update: updateCart,
		change: changeCart,
		queue: cartQueue.startQueue,
		clearQueue: cartQueue.clearQueue
	};
})(Chariot);