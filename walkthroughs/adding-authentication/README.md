# Adding Authentication with Auth0

One of my favorite processes to delegate is authentication. With Auth0 not only will we be able to setup a login process that let's us use third-party authentication (e.g. GitHub, Google, etc.) but we can also manage users in there. There is actually a _ton_ more that we could do with Auth0 but that's all we'll need for the task at hand today.

In this section we'll do a few things together:

- setup Auth0 account
- create a new application
- get needed keys

We'll discuss the code needed to pull Auth0 into the project. Then you'll use your lovely thinking machine to complete the exercise to create a login, sign up, and logout process for users. Auth0 has a really easy way of gating pages so we're going to throw that in there too. This means that we'll make sure people are logged in before they're allowed to see the 'Account' page.

Let's go together.

## Get all the Auth0 things!

Auth0 allows us to create a free account so we can poke around. So let's head to [https://auth0.com/](https://auth0.com/) and get setup. We'll need to go in and create a new application, then grab some the `clientId` and `domain`.

While we have them we can plop that information into both our `environment.ts` file and `environment.prod.ts` file that live in `/src/environments/`.

```ts
// /src/environments/environment.ts
export const environment = {
  production: false,
  auth: {
    domain: "tzmanics.auth0.com",
    clientId: "CdZYQNudmMsaum6W0ouqrMn4WarPfA6o",
  },
};
```

## Let there be login!

We can add a login button to the navigation so it's up there always available for users. First we need to install the Auth0 Angular library.

`npm i @auth0/auth0-angular`

Then incorporate the it into our project via `app.module.ts`

```ts
// /src/app/app.module.ts
...
import { AuthModule } from '@auth0/auth0-angular';

import { environment } from 'src/environments/ environment';

...
  imports: [
    ...
    AuthModule.forRoot(environment.auth),
  ],
...
```

Okay, now it's you'r turn (did you guess that was coming?)

## Exercise 6: Adding a Login Button & User Info

Now that we have Auth0 in the app let's us it by

1. adding login and logout functions to the navigation component
2. adding a beautiful (well, not too bad looking) log in/log out button to the nav
3. adding user data to the Account page

Here we go again! Yay!

Happy coding 👩🏻‍💻!

**Step 1: Login Log Out Functions**

- [ ] import `AuthService` from `@auth0/auth0-angular` and `DOCUMENT` from `@angular/common`

- [ ] in the constructor, inject `auth` and `doc`

  ```ts
    public auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ```

- [ ] make a function called `logout` that calls `this.auth.logout` but passes in an object that contains `returnTo: this.doc.location.origin`

**Step 2: It's Button Time**

- [ ] in the navigation component's template (`/src/app/components/navigation/navigation.component.html`) add a log in button that's `(click)` triggers the `auth.loginWithRedirect()` function

- [ ] make a log out button where the `(click)` triggers the `logout` function we made

**Step 3: Adding User Info**

- [ ] import `AuthService` from `@auth0/auth0-angular` to the Account component class file (`/src/app/pages/account/account.component.ts`)

- [ ] in the page template (`/src/app/pages/account/account.component.html`) create a `<div class="user-profile">` that checks for user information and assigns it to `user`

  ```html
  <div class="user-profile" *ngIf="auth.user$ | async as user"></div>
  ```

- [ ] also include the users picture as class `user-picture` + full name and email in a `<div class="user-info">`

**Bonus Points**

- [ ] show only the log in button if `auth.isAuthenticated$ | async` is false

**FIN**

# Bonus Section

We can also gate a particular route so if a user is not logged in they either can't see the page or must login before accessing it.

This is a pretty quick process because Angular's router helps do a bunch of the heavy lifting. We just need to add the Auth0 AuthGuard library to the app's routes file (`/src/app/app-routing.module.ts `)

```js
import { AuthGuard } from "@auth0/auth0-angular";
```

Then add `canActivate: [AuthGuard],` key/value pair to any route object. Today we'll add it to the Account page.

As with all the sections we can commit this new code to see if in production or run `ntl dev` to see if working locally.
