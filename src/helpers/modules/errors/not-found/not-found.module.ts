import {NgModule} from '@angular/core';
import {NotFoundComponent} from './not-found.component';
import {SharedModule} from "../../../shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [],
    declarations: [NotFoundComponent],
    providers: [],
})
export class NotFoundModule {
}
