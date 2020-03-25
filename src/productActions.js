import ajax from 'ajax';

let Chariot = Chariot || {};
Chariot.product = Chariot.product || {};

Chariot.product.api = (function(Chariot){
		/**
		 * Fetches a product by handle
		 *
		 * @param {callback} callback Function to call after the product is fetched
		 * @param {boolean=} useDefault (Optional) Toggles use of the built in cart JSON view or our custom one
		 */
		function getProduct(handle, callback, useView) {
			let productPath = `/products/`;
			productPath += useView === true ? `${handle}?view=api` : `${handle}.json`;

			callShopify(productPath, 'GET', callback);
		}
	
	return {
		get: getProduct
	}
})(Chariot);