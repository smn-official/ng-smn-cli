import {NgModule} from '@angular/core';
import {NotFoundModule} from './not-found/not-found.module';
import {InternalModule} from './internal/internal.module';
import {ForbiddenModule} from "./forbidden/forbidden.module";

@NgModule({
    imports: [
        NotFoundModule,
        InternalModule,
        ForbiddenModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class ErrorModule {
}
