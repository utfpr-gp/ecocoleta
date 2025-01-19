import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./service/app.layout.service";
import {User, UserService} from "../domains/user/user.service";
import {CollectorAndMapStateService} from "../core/services/collector-and-map-state.service";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrl: './app.footer.component.scss'
})
export class AppFooterComponent implements OnInit {
    user: User | null = null;
    isCollectingFlag: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
    }

    toggleColeta(): void {
        this.isCollectingFlag = !this.isCollectingFlag;
        if (this.isCollectingFlag) {
            this.collectorAndMapStateService.startCollection(this.user?.id);
        } else {
            // todo criar dialog de confirmação
            this.collectorAndMapStateService.stopCollection();
        }
    }
}
