import {Component, OnInit, Type} from '@angular/core';
import {CardModule} from "primeng/card";
import {User, UserRole, UserService} from "../user/user.service";
import {ButtonModule} from "primeng/button";
import {HomeResidentComponent} from "../../shared-components/home-resident/home-resident.component";
import {HomeWasteCollectorComponent} from "../../shared-components/home-waste-collector/home-waste-collector.component";
import {HomeAdminComponent} from "../../shared-components/home-admin/home-admin.component";
import {HomeCompanyComponent} from "../../shared-components/home-company/home-company.component";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CardModule,
        ButtonModule,
        CommonModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    user: User | null = null;
    userRole: UserRole | null = null;
    componentToLoad: Type<any> | null = null;

    private componentMap: { [key in UserRole]: Type<any> } = {
        [UserRole.RESIDENT]: HomeResidentComponent,
        [UserRole.WASTE_COLLECTOR]: HomeWasteCollectorComponent,
        [UserRole.ADMIN]: HomeAdminComponent,
        [UserRole.COMPANY]: HomeCompanyComponent,
    };

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe((user) => {
            this.user = user;
            this.userRole = user?.role as UserRole;
            this.componentToLoad = this.componentMap[this.userRole] || null;
        });
    }
}
