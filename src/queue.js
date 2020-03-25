	/**
	 * Default callback function for cart responses
	 * @callback cartCallback
	 * @param {object} res JSON response object from Shopify
	 */

	let eventQueue = [];

	/**
	 * Determines and runs the next step in the cart queue actions
	 *
	 * @param {function} finishCallback Function to call when the queue is empty
	 * @param {object} res Returned object from the last called action which the callback consumes
	 */
	function queueStep(finishCallback, res) {
		if (eventQueue.length > 0) {
			window.setTimeout(function () {
				// console.log('continuing queue');
				executeQueue(eventQueue.shift(), finishCallback);
			}, 180);
		} else {
			// console.log('finished with queue');
			finishCallback(res);
		}
	}

	/**
	 * Executes a queued cart action and fires `queueStep()`
	 *
	 * @param {object} item A singular cart action and associated data
	 * @param {function} finishCallback Function to call when the queue is empty
	 */
	function executeQueue(item, finishCallback) {
		let apiAction = item.action;
		let callData = item.data;

		let apiCall = Chariot.cart.api[apiAction];

		if (apiAction === 'clear' || apiAction === 'get') {
			apiCall(function (res) {
				queueStep(finishCallback, res);
			}, callData);
		} else {
			apiCall(callData, function (res) {
				queueStep(finishCallback, res);
			});
		}
	}

	/**
	 * Starts and runs a queue of cart actions to perform
	 *
	 * @param {array} queue Array of objects of cart actions to perform
	 * @param {function} finishCallback Function to call when queue is empty
	 */
	function startQueue(queue, finishCallback) {
		// Queue Shape:
		//
		// [
		//   {
		//     action: "add",
		//     data: {
		//       id: 12456,
		//       quantity: 1
		//     }
		//   }, ...
		// ]
		//

		eventQueue = eventQueue.concat(queue);

		let queueItem = eventQueue.shift();

		executeQueue(queueItem, finishCallback);
	}

	/**
	 * Clears the event queue
	 */
	function clearQueue() {
		eventQueue = [];

		return true;
	}

	return {
		clear: clearQueue,
		start: startQueue
	}