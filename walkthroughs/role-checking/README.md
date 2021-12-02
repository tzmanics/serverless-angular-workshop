# Checking Roles with Auth0

Setting roles allows us to gate content, handle privileges, and more. Today we'll just take a little peak into this power by clicking a button to make sure a user had an 'admin' role, and if so, allowing them to see a super secret information (ok, ok, it's just a `<div>` that has some radio buttons BUT it's the skill gaining that counts). We'll create and set the roles in the UI and also look into the API process of coding in role edits.

Per usual, we'll discuss the ins and outs together, have a code alone exercise section, then come back together to code it all out and answer any questions.

## You and I head to the UI

As we saw before the Auth0 is packed with lots of settings that we're just skimming the surface of. Let's head into the 'User Management > Roles' section and create a few roles.

![user mngmt roles menu](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638393465/Screen_Shot_2021-11-27_at_5.42.13_PM_1_gaj5be.jpg)

We'll create an admin role to check against but it's just a text field so you could potentially add whatever you like. Just keep in mind you'll have to use it throughout your app.

Once we have the role created we can assign it to the users.

![assigning roles](https://res.cloudinary.com/dzkoxrsdj/image/upload/v1638411376/Screen_Shot_2021-11-27_at_5.44.30_PM_aylbly.jpg)

## Let's Make a Token

While we're in the UI we can create a Management API Token. There are many caveats to this Token.

1. the way we're creating it today isn't best for production, it expires after 24 hours
2. this token is so long it makes AWS mad as an env var so we're taking a quick and dirty way to use it today
3. in production they recommend executing the Client Credentials exchange in order to acquire tokens

[Here is some more information on Management API Tokens](https://auth0.com/docs/security/tokens/access-tokens/management-api-access-tokens).

For today, we'll take the fast lane! We'll head to the Applications>APIs page and follow the instructions to get a token and use it in the Management API Explorer. Here we can also get the information we need to get user roles.

## It's the Final Function

With the API information and token we can create a serverless function to grab the data we need. Since, this is the bittersweet final function, let's code it together <3

```js
// /netlify/functions/getRoles.js

const axios = require("axios").default;

exports.handler = async (event) => {
  const userId = event.headers.userid;
  let rolesList = [];
  const options = {
    method: "GET",
    url: `https://tzmanics.auth0.com/api/v2/users/${userId}/roles`,
    headers: {
      authorization: "<insert INCREDIBLY long auth here for now>",
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      rolesList = response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rolesList),
  };
};
```

## At Your Service

Per usual, we need a service to invoke this function and pass the data around our app. We can use the generate command again.

`ng g s services/roles-list`

In this service we will use http again to talk to our serverless function.

```ts
// /src/app/services/roles-list.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RolesListService {
  constructor(private http: HttpClient) {}

  getRolesList(userId: string): Observable<any[]> {
    return this.http.get<any[]>("/.netlify/functions/getRoles", {
      headers: {
        userId: userId,
        "Content-Type": "application/json",
      },
    });
  }
}
```

## Are you really an admin?

We can move back to the Account page and test some role permissions out. First in the component's class file (`/src/app/pages/account/account.component.ts `) we need to pull in the service we _just_ made, you remember, right?

```js
import { RolesListService } from "src/app/services/roles-list.service";
```

and it inject it in the constructor

```js
  constructor(
    public auth: AuthService,
    private rolesListService: RolesListService
  ) {}
```

Then we'll make a few variables and assign them.

```js
  rolesList!: Observable<any[]>;
  userId: string = 'userId';
  isAdmin: boolean = false;
```

We need to pass the request for roles the user's id. This can be grabbed from the `auth.user$` observable on init.

```js
  ngOnInit(): void {
    this.auth.user$.subscribe((user) => (this.userId = user!.sub!));
  }
```

The last part is actually putting it all in motion with a ternary to get the roles, pass in the user's id then check to see if any of their roles match the one we care about (in this case 'admin').

```js
  checkIsAdmin(userId: string): void {
    this.rolesListService
      .getRolesList(userId)
      .subscribe((roles) =>
        roles.some((role) => role.name === 'admin')
          ? (this.isAdmin = true)
          : alert('⛔️ You do not have Admin privlidges. ⛔️')
      );
  }
}
```

If they are admin we will switch the `isAdmin` boolean to true. If not, they will get a shocking alert! Now we just need to put something in the template that will trigger this function and test against the boolean.

```html
<!-- /src/app/pages/account/account.component.html -->
<div class="admin-section">
  <button (click)="checkIsAdmin(userId)">Edit Donation Amount</button>
  <div class="donation-amount" *ngIf="isAdmin">
    <input type="radio" name="amount" value="10" checked />$10
    <input type="radio" name="amount" value="20" />$20
    <input type="radio" name="amount" value="30" />$30
    <input type="radio" name="amount" value="40" />$40
  </div>
</div>
```

Now we can run this locally or in production to test it out.

Okay, I do have one last exercise for you.

## Exercise 7: CELEBRATE HOW AWESOME YOU ARE!!

1. You did a great job,
2. You took the time to learn something new, and
3. You know have and know how to create a serverless Angular application that does a ton!!
