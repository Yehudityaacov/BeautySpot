import { Injectable } from "@angular/core";
import { Headers, RequestOptionsArgs } from '@angular/http';

@Injectable()
export class Globals {
    public getRequestOptions(method: string, content: any, headers: Headers | null = null) {

        var _headers = new Headers({
            "Content-Type": "application/json",
            "Accept": "application/json",
        });

        if (headers && headers) {
            for (var i = 0; i < headers.keys.length; i++) {
                _headers.append(headers.keys[i], headers[headers.keys[i]]);
            }
        }
        let options_ = {
            body: content,
            method: method,
            headers: _headers
        };

        return options_;
    }
}