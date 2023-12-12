//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.20.0.0 (NJsonSchema v10.9.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import { mergeMap, catchError, map } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import {
    HttpClient,
    HttpEvent,
    HttpHeaders,
    HttpParams,
    HttpResponse,
    HttpResponseBase,
} from '@angular/common/http';
import { UserRole } from './api-authorization/authorize.service';
import { CreateLotModel, UpdateLotModel } from './models/lots/lot-models';
import { AddBidModel } from './models/bids/bid-models';
import { FilterLot } from './models/lots/filter';

export const API_BASE_URL = new InjectionToken('API_BASE_URL');

@Injectable({
    providedIn: 'root',
})
export class Client {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
        undefined;

    constructor(
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '';
    }

    login(body: LoginViewModel | undefined): Observable<LoginResponse> {
        let url_ = this.baseUrl + '/api/auth/login';

        const content_ = JSON.stringify(body);

        let options_: Object = {
            body: content_,
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http
            .request('post', url_, options_)
            .pipe(
                mergeMap((response: any): Observable<LoginResponse> => {
                    let data: LoginResponse = {};

                    if (response.body !== null) {
                        data = response.body;
                    }

                    return of(data);
                })
            )
            .pipe(
                catchError((error) => {
                    return throwError(() => error);
                })
            );
    }

    assignRoleToUser(
        body: AssignRoleViewModel
    ): Observable<AssignRoleResponse> {
        let url_ = this.baseUrl + `/api/auth/assign-role`;

        const params = new HttpParams().set('role', body.role);

        let options_: Object = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
            params,
        };

        return this.http
            .request('post', url_, options_)
            .pipe(
                mergeMap((response: any): Observable<AssignRoleResponse> => {
                    let data: AssignRoleResponse = {};

                    if (response.body !== null) {
                        data = response.body;
                    }

                    return of(data);
                })
            )
            .pipe(
                catchError((error) => {
                    return throwError(() => error);
                })
            );
    }

    getGoogleClientId(): Observable<string> {
        let url_ = this.baseUrl + '/api/auth/google-client-id';

        let options_: any = {
            responseType: 'text',
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/plain',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<string> => {
                if (response.body !== null) {
                    return of(response.body as string);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }
    signUpWithGoogle(userData: any): Observable<any> {
        const header = new HttpHeaders().set(
            'Content-type',
            'application/json'
        );
        let url_ = this.baseUrl + 'api/auth/sign-up-with-google';

        return this.http.post(url_, JSON.stringify(userData), {
            headers: header,
            withCredentials: true,
        });
    }

    loginWithGoogle(credentials: string): Observable<any> {
        const header = new HttpHeaders().set(
            'Content-type',
            'application/json'
        );
        let url_ = this.baseUrl + 'api/auth/login-with-google';

        return this.http.post(url_, JSON.stringify(credentials), {
            headers: header,
            withCredentials: true,
        });
    }

    register(
        body: RegisterViewModel | undefined
    ): Observable<RegisterResponse> {
        let url_ = this.baseUrl + '/api/auth/register';

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('post', url_, options_).pipe(
            mergeMap((response: any): Observable<RegisterResponse> => {
                let data: RegisterResponse = {};

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }

    getAllCategories(): Observable<Category[]> {
        let url_ = this.baseUrl + '/api/categories';

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<Category[]> => {
                let data: Category[] = [];

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }

    getAllLotStatuses(): Observable<Status[]> {
        let url_ = this.baseUrl + '/api/lotstatuses';

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<Status[]> => {
                let data: Status[] = [];

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }

    getAllLocations(): Observable<AppLocation[]> {
        let url_ = this.baseUrl + '/api/locations';

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<AppLocation[]> => {
                let data: AppLocation[] = [];

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }

    getAllCurrencies(): Observable<Currency[]> {
        let url_ = this.baseUrl + '/api/currencies';

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<Currency[]> => {
                let data: Currency[] = [];

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }

    createLot(body: CreateLotModel): Observable<any> {
        let url_ = this.baseUrl + '/api/lots';

        let formData = new FormData();

        formData.append('title', body.title);
        formData.append('description', body.description);
        formData.append('city', body.city);
        formData.append('address', body.address);
        formData.append('country', body.country);
        formData.append('startDate', new Date(body.startDate!).toISOString());
        formData.append('endDate', new Date(body.endDate!).toISOString());
        formData.append('startingPrice', body.startingPrice?.toString() ?? '');
        formData.append('categoryId', body.categoryId?.toString() ?? '');
        formData.append('currencyId', body.currencyId?.toString() ?? '');
        formData.append('isDraft', body.isDraft?.toString()!);

        if (body.photos !== null) {
            for (const photo of body.photos) {
                formData.append('photos', photo);
            }
        }

        if (body.additionalDocuments !== null) {
            for (const file of body.additionalDocuments) {
                formData.append('additionalDocuments', file);
            }
        }

        let options_: any = {
            body: formData,
        };

        return this.http.request('post', url_, options_).pipe(
            catchError((error) => {
                return throwError(() => error.error);
            })
        );
    }

    updateLot(body: UpdateLotModel): Observable<any> {
        let url_ = this.baseUrl + '/api/lots';

        let formData = new FormData();

        formData.append('id', body.id.toString());
        formData.append('title', body.title);
        formData.append('description', body.description);
        formData.append('city', body.city);
        formData.append('address', body.address);
        formData.append('country', body.country);
        formData.append('startDate', new Date(body.startDate!).toISOString());
        formData.append('endDate', new Date(body.endDate!).toISOString());
        formData.append('startingPrice', body.startingPrice?.toString() ?? '');
        formData.append('categoryId', body.categoryId?.toString() ?? '');
        formData.append('currencyId', body.currencyId?.toString() ?? '');
        formData.append('isDraft', body.isDraft?.toString()!);

        if (body.photos !== null) {
            for (const photo of body.photos) {
                formData.append('photos', photo);
            }
        }

        if (body.additionalDocuments !== null) {
            for (const file of body.additionalDocuments) {
                formData.append('additionalDocuments', file);
            }
        }

        let options_: any = {
            body: formData,
        };

        return this.http.request('put', url_, options_).pipe(
            catchError((error) => {
                return throwError(() => error.error);
            })
        );
    }

    getOneLotForSeller(id: number): Observable<SellerGetLotResponse> {
        let url_ = this.baseUrl + `/api/lots/${id}/sellers`;

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<SellerGetLotResponse> => {
                if (response.body !== null) {
                    let data: SellerGetLotResponse = response.body;

                    return of(data);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }

    getOneLotForBuyer(id: number): Observable<BuyerGetLotResponse> {
        let url_ = this.baseUrl + `/api/lots/${id}/buyers`;

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('get', url_, options_).pipe(
            mergeMap((response: any): Observable<BuyerGetLotResponse> => {
                if (response.body !== null) {
                    let data: BuyerGetLotResponse = response.body;

                    return of(data);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }

    deleteLotFile(id: number, url: string): Observable<any> {
        let url_ = this.baseUrl + `/api/lots/${id}/files`;

        let options_: any = {
            body: [url],
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.delete(url_, options_).pipe(
            mergeMap((response: any): Observable<any> => {
                if (response.body !== null) {
                    return of(response.body);
                } else return throwError(() => new Error('Error'));
            })
        );
    }

    deleteLot(id: number): Observable<string> {
        let url_ = this.baseUrl + `/api/lots/${id}`;

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.delete(url_, options_).pipe(
            mergeMap((response: any): Observable<string> => {
                if (response.body !== null) {
                    return of(response.body as string);
                } else
                    return throwError(
                        () => new Error('Unexpected error occured')
                    );
            }),
            catchError((err: any): Observable<any> => {
                return throwError(() => new Error(err));
            })
        );
    }

    searchLotsByName(name: string): Observable<SearchLotResponse[]> {
        let url_ = this.baseUrl + `/api/lots/names/${name}`;

        let params = new HttpParams().set('pageIndex', 0).set('pageSize', 5);

        return this.http.get(url_, { params }).pipe(
            mergeMap((response: any): Observable<SearchLotResponse[]> => {
                if (response !== null) {
                    let data = response.items as SearchLotResponse[];
                    return of(data);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }

    searchLotsByLocation(locatonName: string): Observable<SearchLotResponse[]> {
        let url_ = this.baseUrl + `/api/lots/locations/${locatonName}`;

        let params = new HttpParams().set('pageIndex', 0).set('pageSize', 5);

        return this.http.get(url_, { params }).pipe(
            mergeMap((response: any): Observable<SearchLotResponse[]> => {
                if (response !== null) {
                    let data = response.items as SearchLotResponse[];
                    return of(data);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }

    getAllBidsOfUserForLot(
        lotId: number,
        pageIndex: number,
        pageSize: number
    ): Observable<BidDto[]> {
        const url = `${this.baseUrl}/api/users/lots/${lotId}/bids`;

        const params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'text/json',
        });

        return this.http.get<BidDto[]>(url, { params, headers }).pipe(
            catchError((error: any) => {
                console.error('Error fetching bids:', error);
                return throwError(() => new Error('Failed to fetch bids'));
            }),
            map((response: any): BidDto[] => {
                if (response && response.items) {
                    return response.items as BidDto[];
                } else {
                    throw new Error('Invalid response structure');
                }
            })
        );
    }

    addBidForLot(body: AddBidModel): Observable<string> {
        let url_ = this.baseUrl + '/api/users/bids';

        let formData = new FormData();

        formData.append('lotId', body.lotId.toString());
        formData.append('bid', body.bid.toString());

        let options_: any = {
            body: formData,
            responseType: 'text',
        };

        return this.http.request('post', url_, options_).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error) => {
                return throwError(() => error.error);
            })
        );
    }
    resetPassword(
        body: ResetPasswordViewModel | undefined
    ): Observable<ResetPasswordResponse> {
        let url_ = this.baseUrl + '/api/auth/reset-password';

        const content_ = JSON.stringify(body);

        let options_: any = {
            body: content_,
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('post', url_, options_).pipe(
            mergeMap((response: any): Observable<ResetPasswordResponse> => {
                let data: ResetPasswordResponse = {};

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }
    forgetPassword(email: string): Observable<ForgetPasswordResponse> {
        let url_ = `${
            this.baseUrl
        }/api/auth/forget-password?email=${encodeURIComponent(email)}`;

        console.log(email);

        let options_: any = {
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'text/json',
            }),
        };

        return this.http.request('post', url_, options_).pipe(
            mergeMap((response: any): Observable<ForgetPasswordResponse> => {
                let data: ForgetPasswordResponse = {};

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }
    filterLots(params: FilterLot): Observable<FilteredLotModel[]> {
        let url_ = this.baseUrl + `/api/lots/filtered-lots`;

        let queryParams = new HttpParams();

        for (const [key, value] of Object.entries(params)) {
            if (key == 'lotStatuses') {
                if (value !== null) {
                    for (const lotId of value as number[]) {
                        queryParams = queryParams.append(
                            key.charAt(0).toUpperCase() + key.slice(1),
                            lotId.toString()
                        );
                    }
                }
            } else {
                if (value !== null) {
                    queryParams = queryParams.set(
                        key.charAt(0).toUpperCase() + key.slice(1),
                        value
                    );
                }
            }
        }

        return this.http.get(url_, { params: queryParams }).pipe(
            mergeMap((response: any): Observable<FilteredLotModel[]> => {
                let data: FilteredLotModel[] = [];

                if (response.body !== null) {
                    data = response.body;
                }

                return of(data);
            })
        );
    }
    getHighestLotPrice(): Observable<number> {
        let url_ = this.baseUrl + `/api/lots/highest-price`;

        return this.http.get(url_).pipe(
            mergeMap((response: any): Observable<number> => {
                if (response !== null) {
                    return of(response as number);
                } else return throwError(() => new Error('data is empty!'));
            })
        );
    }
}

export interface FilteredLotModel {
    id: number;
    title: string;
    description: string;
    startingPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
    category: CategoryDto;
    lotStatus: LotStatusDto;
    location: LocationDto;
    currency: CurrencyDto;
    bids: BidDto[];
    mainPhotoUrl: string | null;
    isInWatchList: boolean;
}

export interface CategoryDto {
    id: number;
    name: string;
    parentCategoryId: number | null;
}

export interface LotStatusDto {
    id: number;
    name: string;
}

export interface LocationDto {
    id: number;
    city: string;
    country: string;
    address: string;
    state: string | null;
}

export interface CurrencyDto {
    id: number;
    code: string;
}

export interface BidDto {
    id: number;
    buyerId: number;
    newPrice: number;
    timeStamp: string;
    currency: string;
    buyer: UserDto;
    bidRemoved: boolean;
}

export interface UserDto {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface SearchLotResponse {
    id: number;
    title: string;
    description: string;
    startingPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
    photosUrl: string[] | null;
    additionalDocumentsUrl: string[] | null;
    category: CategoryDto;
    lotStatus: LotStatusDto;
    location: LocationDto;
    currency: CurrencyDto;
    bids: BidDto[];
    mainPhotoUrl: string;
    seller: UserDto;
    isInWatchList: boolean;
}

export interface BuyerGetLotResponse {
    id: number;
    title: string;
    description: string;
    startingPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
    photosUrl: string[] | null;
    additionalDocumentsUrl: string[] | null;
    category: CategoryDto;
    lotStatus: LotStatusDto;
    location: LocationDto;
    currency: CurrencyDto;
    bids: BidDto[];
    isInWatchlist: boolean;
    bidCount: number | null;
}

export interface SellerGetLotResponse {
    id: number;
    title: string;
    description: string;
    startingPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
    photosUrl: string[] | null;
    additionalDocumentsUrl: string[] | null;
    category: CategoryDto;
    lotStatus: LotStatusDto;
    location: LocationDto;
    currency: CurrencyDto;
    bids: BidDto[];
    bidCount: number | null;
}

export interface CreateLotResponse {
    title: string;
    description: string;
    startingPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
    categoryId: number | null;
    city: string;
    state: string | null;
    country: string | null;
    address: string | null;
    currencyId: number | null;
    photos: File[] | null;
    additionalDocuments: File[] | null;
}

export interface AppLocation {
    city: string;
}

export interface Currency {
    id: number;
    code: string;
}

export interface Status {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    children: Category[];
    parentCategoryId: number | null;
}

export interface LoginResponse {
    message?: string | undefined;
    isSuccess?: boolean;
    errors?: string[] | undefined;
    result?: TokenModel;
}

export interface AssignRoleViewModel {
    role: UserRole;
}

export interface AssignRoleResponse {
    message?: string | undefined;
    isSuccess?: boolean;
    errors?: string[] | undefined;
    result?: TokenModel;
}

export interface TokenModel {
    accessToken: string;
    expireDate: string;
    role: UserRole;
}

export interface RegisterResponse {
    message?: string | undefined;
    isSuccess?: boolean;
    errors?: string[] | undefined;
}

export interface ForgetPasswordResponse {
    message?: string | undefined;
    isSuccess?: boolean;
    errors?: string[] | undefined;
}

export interface ResetPasswordResponse {
    message?: string | undefined;
    isSuccess?: boolean;
    errors?: string[] | undefined;
}

export interface LoginViewModel {
    email: string;
    password: string;
}

export interface RegisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgetPasswordViewModel {
    email: string;
}

export interface ResetPasswordViewModel {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface FileParameter {
    data: any;
    fileName: string;
}

export class ApiException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any };
    result: any;

    constructor(
        message: string,
        status: number,
        response: string,
        headers: { [key: string]: any },
        result: any
    ) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result?: any
): Observable<any> {
    if (result !== null && result !== undefined)
        return throwError(() => result);
    else
        return throwError(
            () => new ApiException(message, status, response, headers, null)
        );
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next('');
            observer.complete();
        } else {
            let reader = new FileReader();
            reader.onload = (event) => {
                observer.next((event.target as any).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}
