var merge = require("lodash/merge");
import { WsService } from './ws.service';
export function WsFactory(backend, baseRequestOptions) {
    baseRequestOptions.merge = function (options) {
        return merge(baseRequestOptions, options);
    };
    return new WsService(backend, baseRequestOptions);
}
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/ws.factory.js.map