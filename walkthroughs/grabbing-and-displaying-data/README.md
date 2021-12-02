# Grabbing and Displaying out Sanity.io Data

We now that we have our CMS setup we can start receiving that data and displaying it in the application. This will consist of us consuming the data we get back from the serverless function we made to get the data from Sanity.io. In Angular it's best to do this with a service. Then call on that service from a component's class file (e.g. `cool-thing.component.ts`) to pass the data to the component's template file (e.g. `cool-thing.component.html`). All these words and all, let's start looking at what this code will look like.

## Making the Angular Service

In the first part of this section we added a Netlify Function to grab the data we needed from Sanity.io. Now, we will use an [Angular service](https://angular.io/guide/architecture-services) to access that data.

### Adding the Organization Model

One thing that we'll need before anything else is an interface of the organization data we're receiving from Sanity.io. An [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) is a TypeScript syntactical contract defining types so they can be checked. The `Organization` interface is very complicated...everything is type `string` 🙃. Rest assured you can assign other types in interfaces.

```typescript
export interface Organization {
  name: string;
  website: string;
  donationAmount: string;
  description: string;
  twitter: string;
  image: string;
}
```

### HTTP For You and Me

Another thing we'll need for the service is the [HTTP Client](https://angular.io/guide/http). This is an injectable class with methods to perform HTTP requests. We'll import that in the app's main module file.

```typescript
// /src/app/app.module.ts

import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavigationComponent } from "./navigation/navigation.component";

@NgModule({
  declarations: [AppComponent, NavigationComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### On To the Actual Service

Again, since this is our first service, let's hold hands. Actually that would make it way harder to code. Let's just code it together.

We'll use the generate commands (in short form) to create a service to call on the serverless function, `getOrgs`.

`ng g s services/organization-list`

Once we have the generated files we can import the HTTP client and the Product interface. We'll also import `Observable` from the [RxJS](https://rxjs.dev/guide/overview) library since the products will be coming through as an observable sequence. We'll also import the `Organization` model we just created.

Inside the `OrganizationListService` class we'll use [dependency injection](https://angular.io/guide/dependency-injection) to use the HTTP client in the service. Finally, we'll make a function, `getOrganizationList` that will be returning `Observable<Organization[]>` from its HTTP GET call to where the Netlify Function lives on the live site: `/.netlify/functions/getOrgs`. The last thing we'll add to the function is an object that passes the GET call a `headers` object that sets the Content-Type to application/json.

Put it all together and what we get:

```typescript
// /src/app/services/organization-list.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Organization } from "../models/Organization";

@Injectable({
  providedIn: "root",
})
export class OrganizationListService {
  constructor(private http: HttpClient) {}

  getOrganizationList(): Observable<Organization[]> {
    return this.http.get<Organization[]>("/.netlify/functions/getOrgs", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
```

## Adding & Updating the Components

Now if this doesn't feel like a great exercise opportunity, I don't know what does! It's time to really see the work we've done, literally.

## Exercise 4: Show me the Data!

This exercise will drill in the methods of passing the data we're getting from the service which is calling the serverless function. Here we will:

1. Use the service in the `Donate` page component
2. Iterate over the list in the `Donate` page template
3. Pass the data to the organization item component
4. Create an organization item template to display each orgs information

Happy coding 👩🏻‍💻!

**Step 0: Just a heads up**
I've already included components in the modules they belong in, created the pages/components, and did some CSS. For your next project, if I'm not there, you'll need to do these things. Maybe I'll be there though ;)

**Step 1: Use the Service**

- [ ] In the `Donate` page components class file (`/src/app/pages/donate/donate.component.ts`) import `Observable` from `rxjs` as well as the Organization service and model

- [ ] declare the organization list inside the class with a non-null operator (to avoid ts yelling) and assign it to and observable of Organization array

  `organizationList!: Observable<Organization[]>;`

- [ ] in the constructor inject the `OrganizationListService` as `private organizationListService`

- [ ] inside `ngOnInit` assign `organizationList` to the function we created in the service

  `this.organizationList = this.organizationListService.getOrganizationList();`

**Step 2: Iterate over the Listerate...wait**

- [ ] in the `Donate` page template (`/src/app/pages/donate/donate.component.html`) add a `<div>` that checks for the `organizationList` then pipes it async as `organizationList`

  `*ngIf="organizationList | async as organizationList`

- [ ] insert the `app-organization-item` component with an `*ngFor` loop over `organizationList` binding the organization item

  ```html
  <app-organization-item
    class="organization-item"
    *ngFor="let organization of organizationList"
    [organization]="organization"
  ></app-organization-item>
  ```

**Step 3: Pass the Data again!**

- [ ] in the organization item's class file (`/src/app/components/organization-item/organization-item.component.ts`) import `HttpClient` and inject it in the constructor

- [ ] import `Input` from `@angular/core` as well as the Organization model

- [ ] use @Input to pass the organization from the parent component (`Donate`) and assign all the values so TypeScript is happy in strict mode

  ```ts
    @Input() organization: Organization = {
    name: 'Organization Name',
    website: 'https://organization.org',
    description: 'This will describe the organization.',
    donationAmount: '10',
    twitter: 'https://twitter.com/organization',
    image: 'https://bit.ly/2ZdePYO',
  };
  ```

**Step 4: Let's see it All!**

- [ ] in the organization items template file (`/src/app/components/organization-item/organization-item.component.html`) create a div that holds all the organization's info named `organization-item-card`

- [ ] add the organization's image, name (using class `organization-name`), website, and twitter

**Bonus Points**

- [ ] add a 'It's loading' template block as an else conditional in the `Donate` component while the organizations are loading

- [ ] make the styling better than I did (then make a PR to the main project 😉)

**FIN**

### Eye on the Product

Get excited, we can finally see how this looks! To do so locally, we can run `ntl dev` in the root directory of the project. Then we'll head to [`localhost:8888/products`](localhost:8888/products).

## Hook it Up

The data from Sanity.io will be added to the site whenever it is built. To make sure we grab data right when it's entered into the CMS, we can set up some hooks.

### Adding a Netlify Build Hook

Netlify provides an easy interface for setting up [Build Hooks](https://hubs.ly/H0HlCyf0) through the project's dashboard. We'll head to Site settings > Build & deploy > Continuous deployment > Build hooks and click the 'Add build hook' button. Today we'll just set the name to 'angular-sanity', for identification, and use the 'main' branch.

Once we have the build hook information saved, we'll get a unique URL to copy for the next step. To trigger this hook, we need to send a POST request to that URL. Thankfully, Sanity.io has a quick process to set up that POST request.

### Creating a Sanity Hook

In the terminal, we need to make sure we're in the `backend` directory where our Sanity.io instance lives. We can then use the Sanity.io CLI to create a hook with just one command.

`sanity hook create`

Does this work? Well, let's add a new product and see about that.

After hitting 'Publish' on the new data, we can look at the Netlify Production deploy logs (on the project's main dashboard) and see that a build has been triggered by the Build Hook.

Once that deploy is published we just head back to our site and, voila, a new product!

## C'est Fini!

We have a list of data pulled in from a headless CMS. Go us!!
