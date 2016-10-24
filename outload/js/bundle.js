(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = "<!--<div id=\"btn-settings\" class=\"settings hidden invisible\">-->\n<div id=\"btn-settings\" class=\"settings \">\n\t<div class=\"setting-btn\">\n\t\t<div class=\"form-group\">\n\t\t\t<label>Title</label>\n\t\t\t<input type=\"text\"\n\t\t\t       class=\"form-control\"\n\t\t\t       maxlength=\"20\"\n\t\t\t       placeholder=\"New button\"\n\t\t\t       required>\n\t\t</div>\n\n\t\t<div class=\"form-group\">\n\t\t\t<div class=\"btn-group btn-group-justified\" data-toggle=\"buttons\">\n\t\t\t\t<label class=\"btn btn-primary active\">\n\t\t\t\t\t<input type=\"radio\"\n\t\t\t\t\t       name=\"button_action\"\n\t\t\t\t\t       value=\"message\"\n\t\t\t\t\t       autocomplete=\"off\"\n\t\t\t\t\t       checked> Send Message\n\t\t\t\t</label>\n\t\t\t\t<label class=\"btn btn-primary\">\n\t\t\t\t\t<input type=\"radio\"\n\t\t\t\t\t       name=\"button_action\"\n\t\t\t\t\t       value=\"url\"\n\t\t\t\t\t       autocomplete=\"off\"> Go to URL\n\t\t\t\t</label>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"form-group\">\n\t\t\t<a href=\"#\" class=\"btn btn-link btn-block\">View messages</a>\n\t\t</div>\n\n\t\t<div class=\"form-group\">\n\t\t\t<a href=\"#\" class=\"btn btn-danger\">Delete</a>\n\t\t</div>\n\t</div>\n</div>";

},{}],2:[function(require,module,exports){
module.exports = "<div class=\"post with-image card\">\n\n\t<div current-image>\n\n\t\t<div class=\"dropzone bg-contains\"\n\t\t     ng-style=\"{'background-image':'url('+vm.currentSlide.imageSrc+')'}\">\n\t\t\t<label for=\"{{ vm.currentSlide.id }}\"\n\t\t\t       class=\"upload-block text-center\">\n\t\t\t\t<span ng-if=\"!vm.currentSlide.imageSrc\">\n\t\t\t\t\t<i class=\"glyphicon glyphicon-camera\"></i>Upload\n\t\t\t\t</span> </label>\n\n\t\t\t<input id=\"{{ vm.currentSlide.id }}\"\n\t\t\t       name=\"file-{{ vm.currentSlide.id }}\"\n\t\t\t       type=\"file\"\n\t\t\t       fileread=\"vm.currentSlide.imageSrc\">\n\t\t</div>\n\t\t<div class=\"form-group\">\n\t\t\t<input ng-model=\"vm.currentSlide.title\"\n\t\t\t       type=\"text\"\n\t\t\t       name=\"title\"\n\t\t\t       class=\"form-control\"\n\t\t\t       placeholder=\"Heading\">\n\n\t\t\t<textarea ng-model=\"vm.currentSlide.description\"\n\t\t\t          class=\"form-control\"\n\t\t\t          name=\"description\"\n\t\t\t          rows=\"1\"\n\t\t\t          placeholder=\"Description\">\n\t\t\t\t\t</textarea>\n\n\t\t\t<input ng-model=\"vm.currentSlide.url\"\n\t\t\t       type=\"text\"\n\t\t\t       name=\"url\"\n\t\t\t       class=\"form-control\"\n\t\t\t       placeholder=\"URL\">\n\t\t</div>\n\n\t\t<div class=\"form-group\">\n\t\t\t<button ng-repeat=\"button in vm.currentSlide.buttons\"\n\t\t\t        type=\"button\"\n\t\t\t        class=\"btn btn-default btn-block\">\n\t\t\t\t<span>{{ button.title || 'Button' }}</span>\n\t\t\t</button>\n\t\t</div>\n\n\t\t<button ng-click=\"vm.currentSlide.addButton()\"\n\t\t        uib-popover-template=\"'popover.html'\"\n\t\t        popover-placement=\"{{ 'right' }}\"\n\t\t        popover-append-to-body=\"true\"\n\t\t        type=\"button\"\n\t\t        class=\"btn btn-default btn-block ctrl add-btn s-brt-1\">\n\t\t\t+ Add Button\n\t\t</button>\n\n\t\t<!--TODO remove before release-->\n\t\t<!--<pre>{{vm.currentSlide | json}}</pre>-->\n\n\t</div>\n\t<div class=\"context-buttons\">\n\n\t\t<div class=\"ctrl pull-left s-cp\" ng-click=\"vm.slideLeft()\">\n\t\t\t<img src=\"img/icons/svg/icon_card-prev.svg\" alt=\"\">\n\t\t</div>\n\n\t\t<div class=\"ctrl pull-right s-cp\" ng-click=\"vm.addImageOrSlideRight()\">\n\t\t\t<img ng-if=\"vm.isLastSlide()\"\n\t\t\t     src=\"img/icons/svg/icon_card-add.svg\"\n\t\t\t     alt=\"\">\n\t\t\t<img ng-if=\"!vm.isLastSlide()\"\n\t\t\t     src=\"img/icons/svg/icon_card-next.svg\"\n\t\t\t     alt=\"\">\n\t\t</div>\n\t</div>\n\n\t<!--TODO remove before release-->\n\t<!--<pre>{{vm | json}}</pre>-->\n\n</div>";

},{}],3:[function(require,module,exports){
module.exports = "<div class=\"post with-image card\">\n\t<div class=\"dropzone bg-contains\"\n\t     ng-style=\"{'background-image':'url('+vm.data.imageSrc+')'}\">\n\t\t<label for=\"{{:: vm.id }}\" class=\"upload-block text-center\">\n\t\t\t<span ng-if=\"!vm.data.imageSrc\">\n\t\t\t\t<i class=\"glyphicon glyphicon-camera\"></i>\n\t\t\t\tUpload image\n\t\t\t</span>\n\t\t</label>\n\t\t<input id=\"{{:: vm.id }}\"\n\t\t       name=\"file-{{:: vm.id }}\"\n\t\t       type=\"file\"\n\t\t       fileread=\"vm.data.imageSrc\">\n\t</div>\n\n\t<!--TODO remove before release-->\n\t<!--<pre>{{vm | json}}</pre>-->\n\n</div>";

},{}],4:[function(require,module,exports){
module.exports = "<div class=\"post card\">\n\n\t<div class=\"form-group\">\n\t\t<textarea ng-model=\"vm.data.text\"\n\t\t          name=\"text\"\n\t\t          class=\"form-control\"\n\t\t          rows=\"4\"\n\t\t          placeholder=\"Add Text\" required>\n\t\t</textarea>\n\t</div>\n\n\t<div class=\"form-group\">\n\t\t<button ng-repeat=\"button in vm.data.buttons\"\n\t\t        type=\"button\"\n\t\t        class=\"btn btn-default btn-block\">\n\t\t\t<span>{{ button.title || 'Button' }}</span>\n\t\t</button>\n\t</div>\n\n\t<button uib-popover-template=\"'popover.html'\"\n\t        popover-placement=\"{{ 'right' }}\"\n\t        popover-append-to-body=\"true\"\n\t        type=\"button\"\n\t        class=\"btn btn-default btn-block ctrl add-btn\">+ Add Button\n\t</button>\n\n\t<!--TODO remove before release-->\n\t<!--<pre>{{vm| json}}</pre>-->\n\n</div>";

},{}],5:[function(require,module,exports){
var uniqueId = function me() {
	me.ids || ( me.ids = {} )
	var newId;

	do { newId = Math.floor(Date.now() * Math.random());
	} while (me.ids[newId]);

	me.ids[newId] = newId;

	return newId;
};

//noinspection JSAnnotator

angular
	.module('app', [
		'ui.router',
		'ui.bootstrap',
		'ngAnimate',
		'broadcastBuilder'
	])

	.controller('RootCtrl', function ($rootScope) {
		var root = this;
		return root;
	})

	.directive("fileread", [function () {

		var returnFalse = function (scope) {
			scope.$apply(function () {
				scope.fileread = "";
			});
		};

		return {
			scope: {
				fileread: "="
			},
			link: function (scope, element, attributes) {
				element.bind("change", function (changeEvent) {
					if (!changeEvent ||
						!changeEvent.target ||
						!changeEvent.target.files ||
						!changeEvent.target.files[0] ) {
						return returnFalse(scope);
					}

					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							scope.fileread = loadEvent.target.result;
						});
					};
					reader.onerror = function (error) {
						console.warn('FileReader error:',error);
					};
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		}
	}])
	.filter('unsafe', ['$sce', function ($sce) {
		return function (val) {
			return $sce.trustAsHtml(val);
		};
	}])
;



angular
	.module('broadcastBuilder', [])

	.constant('MESSAGE_TYPES',{
		TEXT: 0,
		IMAGE: 1,
		GALLERY: 2
	})
	.constant('MESSAGE_ACTION_TYPES',{
		SEND_MESSAGE: 0,
		GO_TO_URL: 1,
	})

	.service('broadcastMessagesService',function (Message) {
		var messages = [];

		return {
			getByParent: function () {
				return messages;
			}
		}
	})

	.factory('Message', function (MESSAGE_TYPES) {
		function Message (type) {
			type || (type = MESSAGE_TYPES.TEXT);
			var message=this,data;
			data = (function (type) {
				switch (+type) {
					case MESSAGE_TYPES.TEXT:
						return {
							text: "",
							buttons:[]
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
			})(type);

			angular.extend(message,{
				id: uniqueId(),
				type: type,
				data: data
			});

			return message;
		}
		return Message;
	})

	.factory('MessageActionButton', function (MESSAGE_ACTION_TYPES) {
		function MessageActionButton (data) {
			data || (data={});
			var type = data.type || MESSAGE_ACTION_TYPES.SEND_MESSAGE;
			var messageActionButton=this;
			var defaults = {
				id: uniqueId(),
				type: type,
				title: "",
				goTourl: "",
				goToMessageId: 0
			};

			angular.extend(
				messageActionButton,
				defaults,
				data
			);

			return messageActionButton;
		}
		return MessageActionButton;

	})

	.factory('MessageImageItem', function () {
		function ImageItem (data) {
			data || (data={});
			var messageImageItem = this;
			return angular.extend(messageImageItem,{
				id: uniqueId(),
				title: "",
				description: "",
				url: "",
				imageSrc: "",
				buttons: []
			}, data);
		}
		return ImageItem;
	})

	.controller('BroadcastBuilder', function (MESSAGE_TYPES, broadcastMessagesService, Message) {
		var vm = this;

		var messages = broadcastMessagesService.getByParent();

		vm.id = uniqueId();
		vm.messages = messages;

		vm.addMessage = function (msgType) {
			if (typeof msgType !== "number") return false;
			vm.messages.push(
				new Message(msgType)
			);
		};

		vm.getMessageType = function (type) {
			if (typeof type === "undefined")
				type = prompt('Тип сообщения (0 | 1 | 2):');
			if (!type) return undefined;
			type-=0;
			if (typeof type == "number" && !isNaN(type))
				return type;
		};

		// TODO remove before release
		// vm.messages.push(
		// 	new Message(MESSAGE_TYPES.TEXT),
		// 	new Message(MESSAGE_TYPES.IMAGE),
		// 	new Message(MESSAGE_TYPES.GALLERY)
		// );

		return vm;
	})

	.directive('messageText', function() { return {
		template: require('./BroadcastBuilder/messages/messageText.tpl.html'),
		controller: 'MessageTextCtrl as vm',
		restrict: 'E',
		scope: {name: '@'},
		link: function (scope, iElement, iAttrs, controller, transcludeFn) {}
	}})
	.controller('MessageTextCtrl', function (MESSAGE_TYPES,Message, MessageActionButton) {
		var vm = this;
		var message = new Message( MESSAGE_TYPES.TEXT );
		var buttonsList = message.data.buttons;

		vm.id = uniqueId();
		angular.extend(vm, message);

		vm.addButton = function (data) {
			buttonsList.push( new MessageActionButton(data) )
		};

		return vm;
	})


	.directive('messageImage', function () { return {
		template: require('./BroadcastBuilder/messages/messageImage.tpl.html'),
		controller: 'MessageImageCtrl as vm',
		restrict: 'E',
		scope: {name: '@'},
		link: function (scope, iElement, iAttrs, controller, transcludeFn) {}
	}})
	.controller('MessageImageCtrl', function (MESSAGE_TYPES,Message,MessageImageItem) {
		var vm = this;
		var message = new Message( MESSAGE_TYPES.IMAGE );

		vm.id = uniqueId();
		angular.extend(vm, message);

		return vm;
	})


	.directive('messageGallery', function () { return {
		template: require('./BroadcastBuilder/messages/messageGallery.tpl.html'),
		controller: 'MessageGalleryCtrl as vm',
		restrict: 'E',
		scope: {name: '@'},
		link: function (scope, iElement, iAttrs, controller, transcludeFn) {}
	}})
	.controller('MessageGalleryCtrl', function ($element,MESSAGE_TYPES, Message, MessageImageItem, MessageActionButton) {
		var vm = this;
		var message = new Message( MESSAGE_TYPES.GALLERY );
		var images = message.data.images;

		vm.id = uniqueId();
		angular.extend(vm, message );

		vm.currentSlide = images[images.length-1];

		vm.addButton = function (data) {
			try {
				vm.currentSlide.buttons.push( new MessageActionButton(data) )
			} catch (err) {
				console.warn("add button err:", err)
			}
		};

		vm.addImage = function () {
			var newImage = new MessageImageItem();
			images.push( newImage );

			newImage.title = images.length-1; // TODO remove before release

			vm.slideTo(images.length-1);
		};
		vm.slideTo = function (newIndex) {
			var currentIndex = images.indexOf( vm.currentSlide );
			var canSlide = newIndex >= 0 && newIndex <= (images.length-1);
			if (!canSlide) return false;
			console.log('slide from',currentIndex,'to',newIndex);
			vm.currentSlide = images[newIndex];
		};
		vm.slideLeft = function () {
			var newIndex = images.indexOf( vm.currentSlide ) - 1;
			vm.slideTo(newIndex);
		};
		vm.slideRight = function () {
			var newIndex = images.indexOf( vm.currentSlide ) + 1;
			vm.slideTo(newIndex);
		};
		vm.isLastSlide = function () {
			var currentIndex = images.indexOf( vm.currentSlide );
			return currentIndex >= images.length-1
		};
		vm.addImageOrSlideRight = function () {
			if (vm.isLastSlide()) { // last
				console.log('vm.addImage');
				vm.addImage();
			} else {
				console.log('vm.slideRight');
				vm.slideRight()
			}
		};

		vm.addImage();

		return vm;
	})


	.directive('actionSelect', function () { return {
		template: require('./BroadcastBuilder/messages/actionSelect.tpl.html'),
		controller: 'ActionSelectCtrl as vm',
		restrict: 'E',
		scope: {name: '@'},
		link: function (scope, iElement, iAttrs, controller, transcludeFn) {}
	}})
	.controller('ActionSelectCtrl', function () {
		var vm = this;
		vm.id = uniqueId();

		return vm;
	})
;
},{"./BroadcastBuilder/messages/actionSelect.tpl.html":1,"./BroadcastBuilder/messages/messageGallery.tpl.html":2,"./BroadcastBuilder/messages/messageImage.tpl.html":3,"./BroadcastBuilder/messages/messageText.tpl.html":4}]},{},[5]);
