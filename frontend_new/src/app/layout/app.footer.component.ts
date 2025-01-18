import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./service/app.layout.service";
import {User, UserService} from "../domains/user/user.service";
import {CollectorStateService} from "../domains/collect/collector-state.service";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrl: './app.footer.component.scss'
})
export class AppFooterComponent implements OnInit {
    user: User | null = null;
    startColetaFlag: boolean = false;

    constructor(public layoutService: LayoutService,
                private userService: UserService,
                private collectorStateService: CollectorStateService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
    }

    toggleColeta(): void {
        this.startColetaFlag = !this.startColetaFlag;
        if (this.startColetaFlag) {
            this.collectorStateService.startCollection();
        } else {
            this.collectorStateService.stopCollection();
        }
    }
}
