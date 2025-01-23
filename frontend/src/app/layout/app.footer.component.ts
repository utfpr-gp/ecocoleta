import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./service/app.layout.service";
import {User, UserService} from "../domains/user/user.service";
import {CollectorAndMapStateService} from "../core/services/collector-and-map-state.service";
import {Observable, take, tap} from "rxjs";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrl: './app.footer.component.scss'
})
export class AppFooterComponent implements OnInit {
    user: User | null = null;
    isCollectingFlag$: Observable<boolean>;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService
    ) {
        // Obtém o estado reativo
        this.isCollectingFlag$ = this.collectorAndMapStateService.coletaStatus$;
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
    }

    toggleColeta(): void {
        this.isCollectingFlag$.pipe(
            take(1), // Garante que pega apenas o valor atual.
            tap(isCollecting => {
                if (!isCollecting) {
                    console.log('BOTÃO FOOTER COLETA START CLICADO - toggleColeta - START'); // todo remove
                    this.collectorAndMapStateService.startCollection(this.user?.id);
                } else {
                    console.log('BOTÃO FOOTER COLETA START CLICADO - toggleColeta - STOP'); // todo remove
                    this.collectorAndMapStateService.stopCollection();
                }
            })
        ).subscribe();
    }
}
