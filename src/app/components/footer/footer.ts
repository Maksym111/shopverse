import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SubscribeForm } from '../subscribe-form/subscribe-form';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SubscribeForm],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  currenYear = new Date().getFullYear();
  isSpecUrl = false;

  constructor(private route: Router) {}

  ngOnInit(): void {
    if (this.route.url === '/login' || this.route.url === '/cart') {
      this.isSpecUrl = true;
    }
  }
}
