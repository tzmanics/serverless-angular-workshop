import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { lastValueFrom } from 'rxjs';

import { Organization } from 'src/app/models/Organization';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.css'],
})
export class OrganizationItemComponent implements OnInit {
  @Input() organization: Organization = {
    name: 'Organization Name',
    website: 'https://organization.org',
    description: 'This will describe the organization.',
    donationAmount: '10',
    twitter: 'https://twitter.com/organization',
    image: 'https://bit.ly/2ZdePYO',
  };

  constructor(private http: HttpClient) {}

  triggerCreateCheckout = async (eventOrganization: any) => {
    const createCheckoutResponse = this.http.post(
      '/.netlify/functions/createCheckout',
      eventOrganization,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const lastResponse = await lastValueFrom(createCheckoutResponse);
    this.openStripe(lastResponse);
  };

  openStripe = async (stripeParams: any) => {
    const stripe = await loadStripe(stripeParams.publishableKey);
    const { error } = await stripe!.redirectToCheckout({
      sessionId: stripeParams.sessionId,
    });
  };

  ngOnInit(): void {}
}
