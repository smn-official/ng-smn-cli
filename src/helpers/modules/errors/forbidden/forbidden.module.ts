import {NgModule} from '@angular/core';
import {ForbiddenComponent} from './forbidden.component';
import {SharedModule} from "../../../shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [],
    declarations: [ForbiddenComponent],
    providers: [],
})
export class ForbiddenModule {
}
