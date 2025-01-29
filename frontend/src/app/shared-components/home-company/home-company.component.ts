import {Component, OnInit} from '@angular/core';
import {CollectService, CollectStatusCount} from "../../domains/collect/collect.service";
import {UserService, UserTypeCount} from "../../domains/user/user.service";
import {CardModule} from "primeng/card";
import {ChartModule} from "primeng/chart";

@Component({
  selector: 'app-home-company',
  standalone: true,
    imports: [
        CardModule,
        ChartModule
    ],
  templateUrl: './home-company.component.html',
  styleUrl: './home-company.component.scss'
})
export class HomeCompanyComponent implements OnInit {

    monthlyCollectData: any;
    dailyCollectData: any;
    userChartData: any;
    chartOptions: any;

    constructor(private collectService: CollectService, private userService: UserService) {}

    ngOnInit(): void {
        this.loadMonthlyCollectData();
        this.loadDailyCollectData();
        this.loadUserReport();

        // Configuração geral dos gráficos
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        };
    }

    /** 📊 Carrega o gráfico de quantidade de coletas no mês (Bar Chart) */
    loadMonthlyCollectData(): void {
        this.collectService.getMonthlyCollectReport().subscribe((data: CollectStatusCount[]) => {
            this.monthlyCollectData = {
                labels: data.map(item => this.getStatusLabel(item.status)),
                datasets: [{
                    label: 'Coletas no Mês',
                    data: data.map(item => item.count),
                    backgroundColor: ['#FF6384', '#4CAF50']
                }]
            };
        });
    }

    /** 📈 Carrega o gráfico de coletas no dia (Line Chart) */
    loadDailyCollectData(): void {
        this.collectService.getDailyCollectReport().subscribe((data: CollectStatusCount[]) => {
            this.dailyCollectData = {
                labels: data.map(item => this.getStatusLabel(item.status)),
                datasets: [{
                    label: 'Coletas Hoje',
                    data: data.map(item => item.count),
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    fill: true
                }]
            };
        });
    }

    /** 🥧 Carrega o gráfico de usuários (Pie Chart) */
    loadUserReport(): void {
        this.userService.getUserReport().subscribe((data: UserTypeCount[]) => {
            // Filtrando apenas WasteCollectors e Residents
            const filteredData = data.filter(user => user.role === 'RESIDENT' || user.role === 'WASTE_COLLECTOR');

            this.userChartData = {
                labels: filteredData.map(user => this.getRoleLabel(user.role)),
                datasets: [{
                    data: filteredData.map(user => user.count),
                    backgroundColor: ['#4CAF50', '#81C784']
                }]
            };
        });
    }

    /** 🔄 Converte status de coleta para rótulos mais amigáveis */
    getStatusLabel(status: string): string {
        switch (status) {
            case 'COMPLETED': return 'Concluídas';
            case 'CANCELLED': return 'Canceladas';
            case 'PENDING': return 'Pendentes';
            default: return status;
        }
    }

    /** 🔄 Converte papéis de usuários para nomes amigáveis */
    getRoleLabel(role: string): string {
        switch (role) {
            case 'RESIDENT': return 'Residentes';
            case 'WASTE_COLLECTOR': return 'Catadores';
            default: return role;
        }
    }
}
