(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "<div ng-sortable=\"vm.sortableConf\">\n\t<div ng-repeat=\"message in vm.messages\"\n\t     ng-switch=\"message.type\">\n\t\t<message-text ng-switch-when=\"0\"\n\t\t              message=\"message\">\n\t\t</message-text>\n\t\t<message-image ng-switch-when=\"1\"\n\t\t               message=\"message\">\n\t\t</message-image>\n\t\t<message-gallery ng-switch-when=\"2\"\n\t\t                 message=\"message\">\n\t\t</message-gallery>\n\t</div>\n</div>\n\n<div class=\"builder-controls\">\n\t<div class=\"ctrl\"\n\t     type=\"button\"\n\t     ng-click=\"vm.addMessage( vm.getMessageType() )\">\n\t\t<img src=\"img/icons/svg/icon_card-add.svg\" alt=\"\">\n\t</div>\n</div>\n\n\n<!--&lt;!&ndash;TODO remove before release&ndash;&gt;-->\n<!--<pre>{{vm.messages | json}}</pre>-->";

},{}],2:[function(require,module,exports){
module.exports = "<button type=\"button\"\n        uib-popover-template=\"'popover.html'\"\n        popover-trigger=\"'click outsideClick'\"\n        popover-placement=\"right\"\n        popover-append-to-body=\"true\"\n        class=\"btn btn-default btn-block\">\n\t{{ vm.button.title || 'Button' }}\n</button>\n";

},{}],3:[function(require,module,exports){
module.exports = "<div class=\"post with-image card\">\n\n\t<div class=\"action-drag-move\">\n\t\t<img src=\"img/icons/svg/icon_move.svg\" alt=\"\">\n\t</div>\n\t<div class=\"action-remove\" ng-click=\"vm.removeMessage()\">\n\t\t<img src=\"img/icons/svg/icon_delete.svg\" alt=\"\">\n\t</div>\n\n\t<div current-image>\n\n\t\t<div class=\"dropzone bg-contains\"\n\t\t     ng-style=\"{'background-image':'url('+vm.currentSlide.imageSrc+')'}\">\n\t\t\t<label for=\"{{ vm.currentSlide.id }}\"\n\t\t\t       class=\"upload-block text-center\">\n\t\t\t\t<span ng-if=\"!vm.currentSlide.imageSrc\">\n\t\t\t\t\t<i class=\"glyphicon glyphicon-camera\"></i>Upload\n\t\t\t\t</span> </label>\n\n\t\t\t<input id=\"{{ vm.currentSlide.id }}\"\n\t\t\t       name=\"file-{{ vm.currentSlide.id }}\"\n\t\t\t       type=\"file\"\n\t\t\t       fileread=\"vm.currentSlide.imageSrc\">\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<input ng-model=\"vm.currentSlide.title\"\n\t\t\t       type=\"text\"\n\t\t\t       name=\"title\"\n\t\t\t       class=\"form-control\"\n\t\t\t       placeholder=\"Heading\">\n\n\t\t\t<textarea ng-model=\"vm.currentSlide.description\"\n\t\t\t          class=\"form-control\"\n\t\t\t          name=\"description\"\n\t\t\t          rows=\"1\"\n\t\t\t          placeholder=\"Description\">\n\t\t\t\t\t</textarea>\n\n\t\t\t<input ng-model=\"vm.currentSlide.url\"\n\t\t\t       type=\"text\"\n\t\t\t       name=\"url\"\n\t\t\t       class=\"form-control\"\n\t\t\t       placeholder=\"URL\">\n\t\t</div>\n\n\t\t<div class=\"form-group\">\n\t\t\t<div ng-repeat=\"button in vm.currentSlide.buttons\">\n\n\t\t\t\t<message-button button=\"button\"\n\t\t\t\t                array=\"vm.currentSlide.buttons\">\n\t\t\t\t</message-button>\n\n\t\t\t</div>\n\t\t</div>\n\n\t\t<button uib-popover-template=\"'popover.html'\"\n\t\t        popover-trigger=\"'click outsideClick'\"\n\t\t        popover-placement=\"right\"\n\t\t        popover-append-to-body=\"true\"\n\t\t        type=\"button\"\n\t\t        class=\"btn btn-default btn-block ctrl add-btn s-brt-1\">\n\t\t\t+ Add Button\n\t\t</button>\n\n\t\t<!--&lt;!&ndash;TODO remove before release&ndash;&gt;-->\n\t\t<!--<pre>{{vm.currentSlide | json}}</pre>-->\n\n\t</div>\n\t<div class=\"context-buttons\">\n\n\t\t<div class=\"ctrl pull-left s-cp\" ng-click=\"vm.slideLeft()\">\n\t\t\t<img src=\"img/icons/svg/icon_card-prev.svg\" alt=\"\">\n\t\t</div>\n\n\t\t<div class=\"ctrl pull-right s-cp\" ng-click=\"vm.addImageOrSlideRight()\">\n\t\t\t<img ng-if=\"vm.isLastSlide()\"\n\t\t\t     src=\"img/icons/svg/icon_card-add.svg\"\n\t\t\t     alt=\"\">\n\t\t\t<img ng-if=\"!vm.isLastSlide()\"\n\t\t\t     src=\"img/icons/svg/icon_card-next.svg\"\n\t\t\t     alt=\"\">\n\t\t</div>\n\t</div>\n\n\t<!--&lt;!&ndash;TODO remove before release&ndash;&gt;-->\n\t<!--<pre>{{vm | json}}</pre>-->\n\n</div>";

},{}],4:[function(require,module,exports){
module.exports = "<div class=\"post with-image card\">\n\n\t<div class=\"action-drag-move\">\n\t\t<img src=\"img/icons/svg/icon_move.svg\" alt=\"\">\n\t</div>\n\t<div class=\"action-remove\" ng-click=\"vm.removeMessage()\">\n\t\t<img src=\"img/icons/svg/icon_delete.svg\" alt=\"\">\n\t</div>\n\n\t<div class=\"dropzone bg-contains\"\n\t     ng-style=\"{'background-image':'url('+vm.message.data.imageSrc+')'}\">\n\t\t<label for=\"{{:: vm.id }}\" class=\"upload-block text-center\">\n\t\t\t<span ng-if=\"!vm.message.data.imageSrc\">\n\t\t\t\t<i class=\"glyphicon glyphicon-camera\"></i>\n\t\t\t\tUpload image\n\t\t\t</span>\n\t\t</label>\n\t\t<input id=\"{{:: vm.id }}\"\n\t\t       name=\"file-{{:: vm.id }}\"\n\t\t       type=\"file\"\n\t\t       fileread=\"vm.message.data.imageSrc\">\n\t</div>\n\n\t<!--TODO remove before release-->\n\t<!--<pre>{{vm | json}}</pre>-->\n\n</div>";

},{}],5:[function(require,module,exports){
module.exports = "<div class=\"post card\">\n\n\t<div class=\"action-drag-move\">\n\t\t<img src=\"img/icons/svg/icon_move.svg\" alt=\"\">\n\t</div>\n\t<div class=\"action-remove\" ng-click=\"vm.removeMessage()\">\n\t\t<img src=\"img/icons/svg/icon_delete.svg\" alt=\"\">\n\t</div>\n\n\t<div class=\"form-group\">\n\t\t<textarea ng-model=\"vm.message.data.text\"\n\t\t          name=\"text\"\n\t\t          class=\"form-control\"\n\t\t          rows=\"4\"\n\t\t          placeholder=\"Add Text\" required>\n\t\t</textarea>\n\t</div>\n\n\t<div class=\"form-group\">\n\t\t<div ng-repeat=\"button in vm.message.data.buttons\">\n\n\t\t\t<message-button button=\"button\"\n\t\t\t                array=\"vm.message.data.buttons\">\n\t\t\t</message-button>\n\n\t\t</div>\n\t</div>\n\n\t<button uib-popover-template=\"'popover.html'\"\n\t        popover-trigger=\"'click outsideClick'\"\n\t        popover-placement=\"right\"\n\t        popover-append-to-body=\"true\"\n\t        type=\"button\"\n\t        class=\"btn btn-default btn-block ctrl add-btn s-brt-1\">+ Add Button\n\t</button>\n\n\t<!--&lt;!&ndash;TODO remove before release&ndash;&gt;-->\n\t<!--<pre>{{vm| json}}</pre>-->\n\n</div>";

},{}],6:[function(require,module,exports){
module.exports = "<form id=\"btn-settings\" class=\"settings\" ng-init=\"button=vm.button || {type:0}\">\n\t<div class=\"setting-btn\">\n\t\t<div class=\"form-group\">\n\t\t\t<input ng-model=\"button.title\"\n\t\t\t       type=\"text\"\n\t\t\t       class=\"form-control\"\n\t\t\t       maxlength=\"50\"\n\t\t\t       placeholder=\"New button\">\n\t\t</div>\n\n\t\t<ul class=\"nav nav-tabs nav-justified\">\n\t\t\t<li role=\"presentation\"\n\t\t\t    ng-model=\"button.type\"\n\t\t\t    uib-btn-radio=\"0\"\n\t\t\t    class=\"active\">\n\t\t\t\t<a href=\"#\">Send Message</a>\n\t\t\t</li>\n\t\t\t<li role=\"presentation\"\n\t\t\t    ng-model=\"button.type\"\n\t\t\t    uib-btn-radio=\"1\">\n\t\t\t\t<a href=\"#\">Go to URL</a>\n\t\t\t</li>\n\t\t</ul>\n\n\t\t<div class=\"form-group\"\n\t\t     ng-switch=\"button.type\">\n\n\t\t\t<div ng-switch-when=\"0\">\n\t\t\t\t<button type=\"button\"\n\t\t\t\t        class=\"btn btn-default s-br-transparent\">+ Add message\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div ng-switch-when=\"1\">\n\t\t\t\t<input ng-model=\"button.goToUrl\"\n\t\t\t\t       type=\"text\"\n\t\t\t\t       class=\"form-control\"\n\t\t\t\t       placeholder=\"url\">\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"clearfix\">\n\t\t\t<button type=\"button\"\n\t\t\t        class=\"btn btn-default pull-left\"\n\t\t\t        ng-click=\"vm.removeButton(button)\">Remove\n\t\t\t</button>\n\t\t\t<button type=\"submit\"\n\t\t\t        class=\"btn btn-success pull-right\"\n\t\t\t        ng-click=\"vm.addButton(button)\">Save\n\t\t\t</button>\n\t\t</div>\n\t</div>\n</form>\n\n<!--&lt;!&ndash;TODO remove before release&ndash;&gt;-->\n<!--<pre>button: {{ button | json }}</pre>-->\n<!--<pre>vm: {{ vm | json }}</pre>-->";

},{}],7:[function(require,module,exports){
'use strict';

var uniqueId = function me() {
	me.ids || (me.ids = {});
	var newId;

	do {
		newId = Math.floor(Date.now() * Math.random());
	} while (me.ids[newId]);

	me.ids[newId] = newId;

	return newId;
};

var remove = function remove() {
	var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var item = arguments[1];

	var itemIndex = arr.indexOf(item);
	if (itemIndex === -1) return false;
	return arr.splice(itemIndex, 1);
};

//noinspection JSAnnotator
angular.module('app', ['ui.router', 'ui.bootstrap', 'ng-sortable', 'ngAnimate', 'broadcastBuilder']).controller('RootCtrl', function ($rootScope) {
	var root = this;
	return root;
}).directive("fileread", [function () {

	var returnFalse = function returnFalse(scope) {
		scope.$apply(function () {
			scope.fileread = "";
		});
	};

	return {
		scope: {
			fileread: "="
		},
		link: function link(scope, element, attributes) {
			element.bind("change", function (changeEvent) {
				if (!changeEvent || !changeEvent.target || !changeEvent.target.files || !changeEvent.target.files[0]) {
					return returnFalse(scope);
				}

				var reader = new FileReader();
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.fileread = loadEvent.target.result;
					});
				};
				reader.onerror = function (error) {
					console.warn('FileReader error:', error);
				};
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	};
}]).filter('unsafe', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsHtml(val);
	};
}]);

angular.module('broadcastBuilder', []).constant('MESSAGE_TYPES', {
	TEXT: 0,
	IMAGE: 1,
	GALLERY: 2
}).constant('MESSAGE_ACTION_TYPES', {
	SEND_MESSAGE: 0,
	GO_TO_URL: 1
}).service('BroadcastMessagesService', function (Message) {
	var messages = [];

	return {
		getByParent: function getByParent() {
			return messages;
		},
		addMessage: function addMessage(type) {
			if (typeof type !== "number") return false;
			var message = new Message(type);
			messages.push(message);
			return message;
		},
		removeMessage: function removeMessage(message) {
			remove(messages, message);
		}
	};
}).factory('Message', function (MESSAGE_TYPES) {
	function Message(type) {
		type || (type = MESSAGE_TYPES.TEXT);
		var message = this,
		    data;
		data = function (type) {
			switch (+type) {
				case MESSAGE_TYPES.TEXT:
					return {
						text: "",
						buttons: []
					};
					break;
				case MESSAGE_TYPES.IMAGE:
					return {
						title: "",
						description: "",
						url: "",
						imageSrc: "",
						buttons: []
					};
					break;
				case MESSAGE_TYPES.GALLERY:
					return {
						images: []
					};
					break;
			}
		}(type);

		angular.extend(message, {
			id: uniqueId(),
			type: type,
			data: data
		});

		return message;
	}
	return Message;
}).factory('MessageActionButton', function (MESSAGE_ACTION_TYPES) {
	function MessageActionButton(data) {
		data || (data = {});
		var type = data.type || MESSAGE_ACTION_TYPES.SEND_MESSAGE;
		var messageActionButton = this;
		var defaults = {
			id: uniqueId(),
			type: type,
			title: "",
			goTourl: "",
			goToMessageId: 0
		};

		angular.extend(messageActionButton, defaults, data);

		return messageActionButton;
	}
	return MessageActionButton;
}).factory('MessageImageItem', function () {
	function ImageItem(data) {
		data || (data = {});
		var messageImageItem = this;
		return angular.extend(messageImageItem, {
			id: uniqueId(),
			title: "",
			description: "",
			url: "",
			imageSrc: "",
			buttons: []
		}, data);
	}
	return ImageItem;
}).directive('broadcastBuilder', function () {
	return {
		template: require('./BroadcastBuilder/broadcastBuilder.tpl.html'),
		controller: 'BroadcastBuilderCtrl as vm',
		restrict: 'E',
		bindToController: true,
		scope: {}
	};
}).controller('BroadcastBuilderCtrl', function (MESSAGE_TYPES, BroadcastMessagesService, Message) {
	var vm = this;

	var messages = BroadcastMessagesService.getByParent();

	vm.id = uniqueId();
	vm.messages = messages;
	vm.addMessage = BroadcastMessagesService.addMessage;

	vm.sortableConf = {
		handle: ".action-drag-move",
		animation: 250
	};

	vm.getMessageType = function (type) {
		if (typeof type === "undefined") type = prompt('Тип сообщения (0 | 1 | 2):');
		if (!type) return undefined;
		type -= 0;
		if (typeof type == "number" && !isNaN(type)) return type;
	};

	// // TODO remove before release
	// vm.addMessage(MESSAGE_TYPES.TEXT);
	// vm.addMessage(MESSAGE_TYPES.IMAGE);
	// vm.addMessage(MESSAGE_TYPES.GALLERY);

	return vm;
}).directive('messageText', function () {
	return {
		template: require('./BroadcastBuilder/messages/messageText.tpl.html'),
		controller: 'MessageTextCtrl as vm',
		restrict: 'E',
		bindToController: true,
		scope: {
			message: "="
		}
	};
}).controller('MessageTextCtrl', function (MESSAGE_TYPES, Message, MessageActionButton, BroadcastMessagesService) {
	var vm = this;
	var message = vm.message;
	var buttonsList = message.data.buttons;

	vm.id = uniqueId();
	vm.removeMessage = function () {
		BroadcastMessagesService.removeMessage(message);
	};

	vm.addButton = function (data) {
		buttonsList.push(new MessageActionButton(data));
	};

	return vm;
}).directive('messageImage', function () {
	return {
		template: require('./BroadcastBuilder/messages/messageImage.tpl.html'),
		controller: 'MessageImageCtrl as vm',
		restrict: 'E',
		bindToController: true,
		scope: {
			message: "="
		},
		link: function link(scope, iElement, iAttrs, controller, transcludeFn) {}
	};
}).controller('MessageImageCtrl', function (MESSAGE_TYPES, Message, MessageImageItem, BroadcastMessagesService) {
	var vm = this;
	var message = vm.message;

	vm.id = uniqueId();
	vm.removeMessage = function () {
		BroadcastMessagesService.removeMessage(message);
	};

	return vm;
}).directive('messageGallery', function () {
	return {
		template: require('./BroadcastBuilder/messages/messageGallery.tpl.html'),
		controller: 'MessageGalleryCtrl as vm',
		restrict: 'E',
		bindToController: true,
		scope: {
			message: "="
		},
		link: function link(scope, iElement, iAttrs, controller, transcludeFn) {}
	};
}).controller('MessageGalleryCtrl', function ($element, MESSAGE_TYPES, Message, MessageImageItem, MessageActionButton, BroadcastMessagesService) {

	var vm = this;
	var message = vm.message;
	var images = message.data.images;
	if (!images) console.warn("no images", vm);

	vm.id = uniqueId();

	vm.currentSlide = images[images.length - 1];

	vm.removeMessage = function () {
		BroadcastMessagesService.removeMessage(message);
	};
	vm.addButton = function (data) {
		try {
			vm.currentSlide.buttons.push(new MessageActionButton(data));
		} catch (err) {
			console.warn("addButton err:", err);
		}
	};
	vm.addImage = function () {
		var newImage = new MessageImageItem();
		images.push(newImage);

		newImage.title = images.length - 1; // TODO remove before release

		vm.slideTo(images.length - 1);
	};
	vm.slideTo = function (newIndex) {
		var currentIndex = images.indexOf(vm.currentSlide);
		var canSlide = newIndex >= 0 && newIndex <= images.length - 1;
		if (!canSlide) return false;
		console.log('slide from', currentIndex, 'to', newIndex);
		vm.currentSlide = images[newIndex];
	};
	vm.slideLeft = function () {
		var newIndex = images.indexOf(vm.currentSlide) - 1;
		vm.slideTo(newIndex);
	};
	vm.slideRight = function () {
		var newIndex = images.indexOf(vm.currentSlide) + 1;
		vm.slideTo(newIndex);
	};
	vm.isLastSlide = function () {
		var currentIndex = images.indexOf(vm.currentSlide);
		return currentIndex >= images.length - 1;
	};
	vm.addImageOrSlideRight = function () {
		if (vm.isLastSlide()) {
			// last1
			console.log('vm.addImage');
			vm.addImage();
		} else {
			console.log('vm.slideRight');
			vm.slideRight();
		}
	};

	vm.addImage();

	return vm;
}).directive('messageButton', function () {
	return {
		template: require('./BroadcastBuilder/messages/messageButton.tpl.html'),
		controller: 'ActionButtonCtrl as vm',
		restrict: 'E',
		bindToController: true,
		scope: {
			button: "=",
			array: "="
		}
	};
}).controller('ActionButtonCtrl', function () {
	var vm = this;
	vm.id = uniqueId();

	vm.removeButton = function (data) {
		remove(vm.array, data);
	};

	return vm;
}).run(function ($templateCache) {
	$templateCache.put('popover.html', require("./BroadcastBuilder/popover.html"));
});

},{"./BroadcastBuilder/broadcastBuilder.tpl.html":1,"./BroadcastBuilder/messages/messageButton.tpl.html":2,"./BroadcastBuilder/messages/messageGallery.tpl.html":3,"./BroadcastBuilder/messages/messageImage.tpl.html":4,"./BroadcastBuilder/messages/messageText.tpl.html":5,"./BroadcastBuilder/popover.html":6}]},{},[7]);
