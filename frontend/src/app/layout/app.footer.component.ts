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
    loading$: Observable<boolean>;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService
    ) {
        // Obtém o estado reativo
        this.isCollectingFlag$ = this.collectorAndMapStateService.coletaStatus$;
        this.loading$ = this.collectorAndMapStateService.loading$;
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
                    this.collectorAndMapStateService.startCollection(this.user?.id);
                } else {
                    this.collectorAndMapStateService.stopCollection();
                }
            })
        ).subscribe();
    }
}
