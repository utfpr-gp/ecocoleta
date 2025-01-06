import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {LayoutService} from "./service/app.layout.service";
import {User, UserService} from "../domains/user/user.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{
    user: User | null = null;
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        // this.userService.userSubject.subscribe((user) => {
        //     this.user = user;
        // });
        this.userService.user$.subscribe(user => {
            this.user = user;
        });

        console.log('foooter this.user', this.user);
    }

    logout(): void {
        this.userService.logout();
    }

}
