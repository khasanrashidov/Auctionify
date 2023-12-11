import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { isSellerGuard } from './guards/seller/is-seller.guard';
import { UserProfileComponent } from './components/general/user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './components/general/update-user-profile/update-user-profile.component';
import { ChangePasswordComponent } from './components/general/change-password/change-password.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: UserProfileComponent },
    {
        path: 'profile',
        loadChildren: () =>
            import('./components/general/general.module').then(
                (m) => m.GeneralModule
            ),
    },
    {
        path: 'seller',
        loadChildren: () =>
            import('./components/seller/seller.module').then(
                (m) => m.SellerModule
            ),
        data: { breadcrumb: { skip: true } },
        canActivate: [isSellerGuard],
    },
    {
        path: 'buyer',
        loadChildren: () =>
            import('./components/buyer/buyer.module').then(
                (m) => m.BuyerModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
