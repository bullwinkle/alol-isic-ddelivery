import * as _ from "lodash";
var merge = _.merge;
import { HttpService } from './http.service';
export function HttpFactory(xhrBackend, baseRequestOptions) {
    var backend = xhrBackend;
    baseRequestOptions.merge = function (options) {
        return merge(baseRequestOptions, options, {
            withCredentials: true
        });
    };
    return new HttpService(backend, baseRequestOptions);
}
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/app/shared/http.factory.js.map