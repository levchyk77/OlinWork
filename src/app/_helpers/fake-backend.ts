import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';
import { Role, User } from '../_models';
import { JobOfer } from '../_models/job-offfer';

/*
FAKE BACKEND


This will serve as a standalone backend with delayed response so that it can imitate a real backend - using
DELAYED OBSERVABLE.

It will:
1. check the user credentails that come from "Authentication Service" during login
2. be used for registration, getting users list, deleting users and changig the users` role
3. work as a database for the list of users and job offers
4. generate a HttpResponse


API
1. /users/authenticate && method = 'POST' - to check credentials and to get the user`s object
2. /users/register && method === 'POST' - to register a new user
3. /users && method === 'GET' - to get the list of users
4. /\/users\/\d+$/ && method === 'DELETE' - to delete user by id
*/



let users: User[] = [
    { id: 1, firstName: 'Daniel', lastName: 'Shumov', userName: 'admin', password: 'admin', role: Role.Admin },
    { id: 2, firstName: 'moderator', lastName: 'moderator', userName: 'moderator', password: 'moderator', role: Role.Moderator },
    { id: 3, firstName: 'user', lastName: 'user', userName: 'user', password: 'user', role: Role.User }
];
let jobOffers: JobOfer[] = [
    {
        id: 1, jobTitle: 'Architect', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et' +
            ' ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, '+
            'consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' +
            ' erat, sed diam voluptua. At vero eos et accusam et justo duo...',
        salary: 15000
    },
    {
        id: 1, jobTitle: 'Architect', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et' +
            ' ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, '+
            'consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' +
            ' erat, sed diam voluptua. At vero eos et accusam et justo duo...',
        salary: 15000
    },
    {
        id: 1, jobTitle: 'Architect', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et' +
            ' ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, '+
            'consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' +
            ' erat, sed diam voluptua. At vero eos et accusam et justo duo...',
        salary: 15000
    }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // destructing operator (https://javascript.info/destructuring-assignment)
        // order doesn`t matter
        const { url, method, headers, body, params } = request;


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
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/job-offers') && method === 'GET':
                    return getJobOffers();
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
                role: user.role,
                token: `fake-jwt-token.${user.role}`
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

            user.role = Role.User;
            users.push(user);
            // delete after backend is provided
            // made for cases when browser is refreshed or closed
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }
        /* -------- Working with the list of usets -------- */
        function getUsers() {
            if (!isLoggedIn()) {
                // ! using a heper function to make code reusable and simplier to read
                return unauthorized();
            }
            const type = params.get('type');

            if (type === '0') {
                // returns only moderators
                return ok(getOnlyModerators());
            } else if (type === '1') {
                // returns only users
                return ok(getOnlyUsers());
            } else {
                // returns the list of users except for admins
                localStorage.setItem('users', JSON.stringify(users));
                return ok(users.filter(x => x.role !== Role.Admin));

            }
        }
        function deleteUser() {
            if (!isLoggedIn) {
                return unauthorized();
            }
            // deleting user with the id from url
            users = users.filter(x => x.id !== idFormUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }
        /* Working with list of job offres  */
        function getJobOffers() {
            localStorage.setItem('Job Offers', JSON.stringify(jobOffers));
            return ok(jobOffers);
        }
        /* -------- helper functions -------- */
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }
        function error(message) {
            return throwError({ error: { message } });
        }
        function isLoggedIn() {
            return headers.get('Authorization').startsWith('Bearer fake-jwt-token');
        }
        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
        function idFormUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
        function getOnlyUsers() {
            return users.filter(x => x.role === Role.User);
        }
        function getOnlyModerators() {
            return users.filter(x => x.role === Role.Moderator);
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
