import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NewCollectComponent} from "./new-collect/new-collect.component";
import {CurrentCollectComponent} from "./current-collect/current-collect.component";
import {CollectHistoricComponent} from "./collect-historic/collect-historic.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'nova', component: NewCollectComponent },
        { path: 'em-andamento', component: CurrentCollectComponent },
        { path: 'historico', component: CollectHistoricComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class CollectRoutingModule { }
