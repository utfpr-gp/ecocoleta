import {Component, OnInit} from '@angular/core';
import {UserService, UserTypeCount} from "../../domains/user/user.service";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";

@Component({
    selector: 'app-home-admin',
    standalone: true,
    imports: [
        CardModule,
        ChartModule
    ],
    templateUrl: './home-admin.component.html',
    styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent implements OnInit {

    userChartData: any;
    userChartOptions: any;

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.loadUserReport();

        // Configuração do gráfico
        this.userChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            }
        };
    }

    loadUserReport(): void {
        this.userService.getUserReport().subscribe((data: UserTypeCount[]) => {
            // Filtrando para remover ADMIN
            const filteredData = data.filter(user => user.role !== 'ADMIN');

            this.userChartData = {
                labels: filteredData.map(user => this.getRoleLabel(user.role)),
                datasets: [{
                    data: filteredData.map(user => user.count),
                    backgroundColor: ['#4CAF50', '#81C784', '#2E7D32'], // Tons de verde
                    hoverBackgroundColor: ['#388E3C', '#66BB6A', '#1B5E20'] // Efeito ao passar o mouse
                }]
            };
        });
    }

    // Converte os papéis para rótulos amigáveis
    getRoleLabel(role: string): string {
        switch (role) {
            case 'RESIDENT':
                return 'Residentes';
            case 'WASTE_COLLECTOR':
                return 'Catadores';
            case 'COMPANY':
                return 'Empresas';
            default:
                return role;
        }
    }
}
