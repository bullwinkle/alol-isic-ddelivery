import { ReadyState, Response, Headers } from "@angular/http";
import { Observable } from "rxjs";
export var WsConnection = (function () {
    function WsConnection(request) {
        this.request = request;
        this.readyState = ReadyState.Open;
        this.response = new Observable(function (responseObserver) {
            var response = new Response({
                body: {
                    webSocketResponse: {
                        hello: 'world'
                    }
                },
                status: 200,
                headers: new Headers(),
                url: request.url,
                merge: function (options) {
                    return options;
                }
            });
            responseObserver.next(response);
        });
    }
    return WsConnection;
}());
export var WsConnectionBackend = (function () {
    function WsConnectionBackend() {
    }
    WsConnectionBackend.prototype.createConnection = function (request) {
        return new WsConnection(request);
    };
    return WsConnectionBackend;
}());
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/ws-backend.js.map