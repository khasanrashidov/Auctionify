import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import {
  AssignRoleResponse,
  AssignRoleViewModel,
  Client,
  LoginResponse,
  LoginViewModel,
  RegisterResponse,
  RegisterViewModel,
} from '../web-api-client';
import { HttpErrorResponse } from '@angular/common/http';

export enum UserRole {
  Administrator = "Administrator",
  Seller = "Seller",
  Buyer = "Buyer",
  User = "User",
}

export interface IUser {
  userToken: string;
  role: UserRole;
  expireDate: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthorizeService {
  private tokenString: string = 'token';
  private expireString: string = 'expires_at';
  private roleString: string = 'role'
  private user: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);

  constructor(private client: Client, private httpClient: HttpClient) {
    this.initializeAuthorizeService();
  }

  private initializeAuthorizeService() {
    const token = localStorage.getItem(this.tokenString);
    const tokenExpireDate = localStorage.getItem(this.expireString);
    const role = localStorage.getItem(this.roleString);
    if (token === null &&
      tokenExpireDate === null &&
      role === null) return;

    const roleEnum: UserRole = role as UserRole;

    const user: IUser = {
      userToken: token!,
      expireDate: tokenExpireDate!,
      role: roleEnum
    }

    this.user.next(user)
  }

  login(email: string, password: string) : Observable<LoginResponse | boolean> {
    const loginData: LoginViewModel = {
      email,
      password,
    };

    return this.client
      .login(loginData)
      .pipe(map((response): boolean => {
        this.processLoginResponse(response);
        return true;
      }))
      .pipe(catchError((err: HttpErrorResponse): Observable<LoginResponse>  => {
        return throwError(() => err.error);
      }));
  }

  assignRoleToUser(role: UserRole): Observable<AssignRoleResponse | boolean> {

    const roleAssignmentData: AssignRoleViewModel = {
      role
    };
  
    return this.client.assignRoleToUser(roleAssignmentData).pipe(map((result) => {
      return result;
    }))
  }

  private processLoginResponse(response: LoginResponse) {
    if (response.result === undefined) throw new Error("user not found");
    let newUser: IUser = {
      userToken: response.result.accessToken,
      role: response.result.role,
      expireDate: response.result.expireDate,
    }

    localStorage.setItem(this.tokenString, response.result.accessToken);
    localStorage.setItem(this.expireString, newUser.expireDate);
    localStorage.setItem(this.roleString, newUser.role);

    this.user.next(newUser);
  }

  loginWithGoogle(credentials: string): Observable<any> {
    return this.client.loginWithGoogle(credentials)
    .pipe(map((response): boolean => {
      this.processLoginResponse(response);
      return true;
    }))
    .pipe(catchError((err: HttpErrorResponse): Observable<LoginResponse>  => {
      return throwError(() => err.error);
    }));
  }

  register(
    email: string,
    password: string,
    confirmPassword: string
  ) : Observable<RegisterResponse | undefined> {
    const registerData: RegisterViewModel = {
      email,
      password,
      confirmPassword,
    };

    return this.client.register(registerData).pipe(map((result) => {
      return result;
    }))
  }

  logout(): boolean {
    localStorage.removeItem(this.tokenString);
    localStorage.removeItem(this.expireString);
    this.user.next(null);

    return true;
  }

  getAccessToken(): Observable<string | null> {
    const localToken = localStorage.getItem(this.tokenString);

    if(localToken === null && localToken !== this.user.value?.userToken) return of(null);
    return of(localToken);
  }

  isUserBuyer(): boolean {
    return this.user.value?.role == UserRole.Buyer;
  }

  isUserSeller(): boolean {
    return this.user.value?.role === UserRole.Seller;
  }

  isUserLoggedIn(): boolean {
    return this.user.value !== null && this.getAccessToken() !== null;
  }
}
