import {Component, OnInit} from '@angular/core';
import {LayoutService} from "./service/app.layout.service";
import {User, UserService} from "../domains/user/user.service";

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
    user: User | null = null;

    constructor(public layoutService: LayoutService,
                private userService: UserService
    ) {
    }

    ngOnInit(): void {
        this.userService.userSubject.subscribe((user) => {
            this.user = user;
        });
    }
}
