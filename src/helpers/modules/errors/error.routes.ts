import {Routes} from "@angular/router";
import {NotFoundComponent} from "./not-found/not-found.component";
import {InternalComponent} from "./internal/internal.component";
import {ForbiddenComponent} from "./forbidden/forbidden.component";

export const ERROR_ROUTES: Routes = [
    {path: 'internal', component: InternalComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'forbidden', component: ForbiddenComponent},
    {path: '**', redirectTo: 'not-found'}
];
