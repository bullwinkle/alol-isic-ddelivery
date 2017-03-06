import { ReadyState } from "@angular/http";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
export var WsConnection = (function () {
    function WsConnection(request) {
        this.request = request;
        this.readyState = ReadyState.Open;
        this.response = new Observable(function (responseObserver) {
            var response = ApiService.buildResponse(request);
            responseObserver.next(response);
            responseObserver.complete();
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
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/ws.backend.js.map