import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

let users = [{ id: 1, firstName: 'Daniel', lastName: 'Shumov', userName: 'test', password: 'test' }]
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // destructing operator (https://javascript.info/destructuring-assignment)
        // order doesn`t matter
        const { url, method, headers, body } = request;


        // wrap in delayed observable to simulate server api called
        return of(null)
            .pipe(mergeMap(handlleRoute))
            .pipe(materialize()) // ensuring delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648) 
            .pipe(delay(500))
            .pipe(dematerialize());

        function handlleRoute() {
            // using switch(true) insted of if-else loop
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate(); // authenticate()
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                default:
                    // passing control to the next interceptor in the chain, if there is one.
                    return next.handle(request);
            }
        }

        /*  -------- Authentication -------- */
        function authenticate() {

            // destructing operator (https://javascript.info/destructuring-assignment)
            const { username, password } = body;
            const user = users.find(x => x.userName === username && x.password === password);

            if (!user) {
                return error('Username or password is invalid');
            }
            return ok({
                id: user.id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            });

        }
        /* -------- Registraition -------- */
        function register() {
            const user = body;
            // checking if userName is already taken
            if (users.find(x => x.userName === user.userName)) {
                return error('Username "' + user.userName + '" is already taken.');
            }

            // using spread operator to get individual elements, so that we can use Math.max() method
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            // delete after backend is provided
            // made for cases when browser is refreshed or closed
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }
        /* -------- helper functions -------- */
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }
        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export const FakeBackendProvider = {
    // The interceptor needs to be added to the HTTP_INTERCEPTORS array.
    // This is done by making the existing HTTP_INTERCEPTORS array use the new class we’ve created.
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
