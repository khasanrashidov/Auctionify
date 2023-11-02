import { Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthorizeService } from '../authorize.service';
import { Dialog } from '@angular/cdk/dialog';
import { DialogPopupComponent } from 'src/app/ui-elements/dialog-popup/dialog-popup.component';
import { Router } from '@angular/router';
import { ResetPasswordResponse } from 'src/app/web-api-client';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  isLoading = false;

  constructor(private authService: AuthorizeService, public dialog: Dialog, private router: Router) {

  }
  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  })

  onSubmit() {
    this.isLoading = true;
    if (this.resetPasswordForm.invalid) {
      this.isLoading = false;
      return;
    }

    this.authService.resetPassword(
      this.resetPasswordForm.controls.password.value!,
      this.resetPasswordForm.controls.confirmPassword.value!)
      .subscribe({
        next: (result) => {
          this.router.navigate(['/home'])
        },
        error: (error: ResetPasswordResponse) => {
          this.openDialog(error.errors!, true);
        }
      })
  }

  openDialog(text: string[], error: boolean) {
    const dialogRef = this.dialog.open<string>(DialogPopupComponent, {
      data: {
        text,
        isError: error
      },
    });

    dialogRef.closed.subscribe((res) => {
      this.isLoading = false;
      this.resetPasswordForm.controls.password.reset();
      this.resetPasswordForm.controls.confirmPassword.reset();
    })
  }
}
