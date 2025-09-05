import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-subscribe-form',
  imports: [FormsModule],
  templateUrl: './subscribe-form.html',
  styleUrl: './subscribe-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribeForm {
  inputValue = '';
  errorMsg = false;

  onSubmit(formEl: NgForm) {
    if (formEl.invalid) {
      this.errorMsg = true;
      return;
    }

    this.errorMsg = false;

    console.log(formEl);
  }
}
