//TODO: Reescrever
import {Injectable} from '@angular/core';

import {Http, Response, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {UiSnackbar} from 'ng-smn-ui';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {UserService} from "../utils/user/user.service";

interface config {
    headers?: {}
}

let API: {};
let OPTIONS: any;
let config: config = {};

@Injectable()
export class ApiService {
    constructor(private _http: Http, private httpClient: HttpClient) {
    }

    public set(methods, options) {
        API = methods;
        OPTIONS = options;
    }

    public prep(api: string, funcionalidade: string, metodo: string, newConfig: any = {}) {
        if (!API[api][funcionalidade][metodo]) {
            console.error('Método não existe', metodo);
            return () => {};
        }

        const method = API[api][funcionalidade][metodo];
        const option = OPTIONS.filter(item => item.url === location.pathname.replace('/', ''));

        config.headers = {
            'Content-Type': 'application/json',
            'Authentication': UserService.getToken(),
            'Option': option && option.length ? option[0].id : null
        };

        return {
            call: this._call(method, newConfig)
        }
    }

    public http(metodo: string, url: string, newConfig: any = {}) {
        const method = {
            url,
            method: metodo
        };

        if (newConfig.headers) {
            config.headers = newConfig.headers
        }

        return {
            call: this._call(method, newConfig)
        }
    }

    private _call(metodo: any, newConfig: any = {}): Function {
        return (data: {}) => {
            const method = metodo.method.toLowerCase();
            let url = metodo.url;
            let headers;

            if (newConfig.httpClient) {
                headers = new HttpHeaders();
            } else {
                headers = new Headers();
            }

            const setHeaders = config.headers;
            if (setHeaders) {
                Object.keys(setHeaders).forEach((key) => {
                    headers.append(key, setHeaders[key]);
                });
            }

            let secondParam = data;
            let thirdParam = {
                headers
            };

            if (data) {
                const urlParams = ApiServiceUtils.jsonToParams(url, data);
                url = urlParams.url;
                data = urlParams.data;
            }

            if (method === 'get' || method === 'delete') {
                if (data) {
                    url = url + ApiServiceUtils.jsonToQueryString(data);
                }
                secondParam = thirdParam;
                thirdParam = undefined;
            }

            if (newConfig.httpClient) {
                const req = new HttpRequest(method, url, secondParam, thirdParam);
                return this.httpClient.request(req);
            } else {
                const http = this._http[method](url, secondParam, thirdParam)
                    .map(ApiServiceUtils.extractData)
                    .catch(ApiServiceUtils.handleError);

                return {
                    subscribe: (pNext, pError?, pFinally?) => {
                        return http.finally(pFinally).subscribe(pNext, pError);
                    }
                }
            }
        }
    }
}

class ApiServiceUtils {
    public static extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    public static handleError(error: Response | any) {
        let body: any;
        if (error instanceof Response) {

            body = error.json() || {};

            if (error) {
                body._status = error.status;
                body._statusText = error.statusText;
            }

            switch (error.status) {
                case 0:
                    UiSnackbar.show({
                        text: 'Um de nossos serviços está fora do ar e não foi possível processar sua requisição. ' +
                        'Tente novamente mais tarde.',
                        actionText: 'OK',
                        action: close => close(),
                        duration: Infinity
                    });
                    break;
                case 400:
                    UiSnackbar.show({
                        text: 'Requisição inválida. Verifique as informações fornecidas.',
                        actionText: 'OK',
                        duration: Infinity,
                        action: close => close()
                    });
                    break;
                case 409:
                    UiSnackbar.show({
                        text: body.message,
                        actionText: 'OK',
                        action: close => close()
                    });
                    break;
                case 500:
                    UiSnackbar.show({
                        text: 'Ocorreu um erro interno. Já fomos informados do erro. Tente novamente mais tarde.',
                        actionText: 'OK',
                        duration: Infinity,
                        action: close => close()
                    });
            }
        } else {
            UiSnackbar.show({
                text: 'Ocorreu um erro desconhecido. Tente novamente mais tarde.',
                actionText: 'OK',
                duration: Infinity,
                action: close => close()
            });
        }
        return Observable.throw(body);
    }

    public static jsonToQueryString(json) {
        const params = Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        });
        return (params.length ? '?' : '') + params.join('&');
    }

    public static jsonToParams(url, data) {
        const dataClone = Object.assign({}, data);
        url = url.split('/');
        Object.keys(dataClone).forEach((key) => {
            const indexOf = url.indexOf(`:${key}`);
            if (indexOf !== -1) {
                url[indexOf] = dataClone[key];
                delete dataClone[key];
            }
        });

        url = url.join('/');

        return {
            url: url,
            data: dataClone
        };
    }
}

