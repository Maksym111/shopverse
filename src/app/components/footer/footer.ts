import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubscribeForm } from '../subscribe-form/subscribe-form';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SubscribeForm],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currenYear = new Date().getFullYear();
}
