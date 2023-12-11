import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthorizeService } from 'src/app/api-authorization/authorize.service';
import { FileModel } from 'src/app/models/fileModel';
import { BuyerModel, SellerModel, UpdateUserProfileModel } from 'src/app/models/users/user-models';
import { Client } from 'src/app/web-api-client';

export interface ProfileFormModel {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    aboutMe: FormControl<string | null>;
    profilePicture: FormControl<FileModel | null>;
    deleteProfilePicture: FormControl<boolean | null>;
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent {
  
  userProfileData: BuyerModel | SellerModel | null = null;
  isLoading = false;

  constructor(
    private authorizeService: AuthorizeService, 
    private client: Client, 
    private router: Router
    ) {}

  ngOnInit(): void {
    this.fetchUserProfileData();
  }

  profileForm = new FormGroup<ProfileFormModel>({
    firstName: new FormControl<string>('', [
      Validators.required, 
      Validators.pattern(/^[a-zA-Z]*$/),
      Validators.maxLength(30),
    ]),
    lastName: new FormControl<string>('', [
      Validators.required, 
      Validators.pattern(/^[a-zA-Z]*$/),
      Validators.maxLength(30),
    ]),
    aboutMe: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(30),
    ]),
    phoneNumber: new FormControl<string>('', [
      Validators.required, 
      Validators.pattern(/^\+\d{1,15}$/),
    ]),
    profilePicture: new FormControl<FileModel | null>(null),
    deleteProfilePicture: new FormControl<boolean>(false)
  });

  toggleDeleteProfilePicture() {
    this.profileForm.controls.deleteProfilePicture.setValue(
        !this.profileForm.controls.deleteProfilePicture.value
    );
  }

  onFileChange(event: any) {
      const fileInput = event.target;

      if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];

          const fileModel: FileModel = {
              name: file.name,
              file,
              fileUrl: URL.createObjectURL(file),
          };

          this.profileForm.controls.profilePicture.setValue(fileModel);

          this.profileForm.controls.deleteProfilePicture.setValue(true);
      }
  }

  private fetchUserProfileData() {
    if (this.isUserBuyer()) {
      this.client.getBuyer()
        .subscribe(
          (data: BuyerModel) => {
            this.setFormControlData(data);
          },
          (error) => {
          }
        );
      console.log('User is a buyer.');
    } else if (this.isUserSeller()) {
      this.client.getSeller()
        .subscribe(
          (data: SellerModel) => {
            this.setFormControlData(data);
          },
          (error) => {
          }
        );
      console.log('User is a seller.');
    }
  }

  setFormControlData(
    userProfileData: BuyerModel | SellerModel | null = null
    )  
    {
    if (userProfileData) {
      this.userProfileData = userProfileData
      this.profileForm.setValue({
        firstName: userProfileData.firstName || '',
        lastName: userProfileData.lastName || '',
        aboutMe: userProfileData.aboutMe || '',
        phoneNumber: userProfileData.phoneNumber || '',
        profilePicture: null,
        deleteProfilePicture: false,
      });
    }
  }

  OnSubmit() {

    this.isLoading = true;

    if (this.profileForm.invalid) {
      this.isLoading = false;
      return;
    }

    const formValue = this.profileForm.value;
  
    const updateProfileModel: UpdateUserProfileModel = {
      firstName: formValue.firstName || null,
      lastName: formValue.lastName || null,
      phoneNumber: formValue.phoneNumber || null,
      aboutMe: formValue.aboutMe || null,
      profilePicture: formValue.profilePicture ? formValue.profilePicture.file : null,
      deleteProfilePicture: !!formValue.deleteProfilePicture,
    };
  
    this.client.updateProfile(updateProfileModel)
    .subscribe({
      next: (result) => {
        if (result) {
          this.router.navigate(['/profile'])
      }
    },
    complete: () => {
      this.isLoading = false;
      }
    });
  }
  
  isUserSeller(): boolean {
    return this.authorizeService.isUserSeller();
  }

  isUserBuyer(): boolean {
    return this.authorizeService.isUserBuyer();
  }
}
