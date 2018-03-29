import {NgModule} from '@angular/core';
import {InternalComponent} from './internal.component';
import {SharedModule} from "../../../shared.module";

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [],
    declarations: [InternalComponent],
    providers: [],
})
export class InternalModule {
}
