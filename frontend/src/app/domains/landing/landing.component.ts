import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LayoutService} from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {
    carouselImages: string[] = [
        'assets/imagens/carousel-landing/image1.jpg',
        'assets/imagens/carousel-landing/image2.jpg',
        'assets/imagens/carousel-landing/image3.jpg',
    ];

    events: any[] = [
        {
            title: "1. Separação",
            description: "Antes de solicitar uma coleta, os resíduos recicláveis precisam ser higienizados, separados e embalados da maneira correta para facilitar o trabalho do catador."
        },
        {
            title: "2. Solicitar Coleta",
            description: "Depois de separar os materiais, é hora de solicitar uma coleta."
        },
        {
            title: "3. Coleta",
            description: "O processo de coleta é automatizado. Assim que você solicitar a coleta, ela ficará visível para um catador, que receberá a atribuição automaticamente com uma rota otimizada. Lembre-se: se o material estiver no interior da casa, pause a coleta temporariamente para evitar atrasos ao catador."
        },
        {
            title: "4. Impacto",
            description: "Finalizar a coleta contribui para o meio ambiente e aumenta a renda dos catadores. Valorize o trabalho de quem faz a reciclagem acontecer!"
        }
    ];

    tips = [
        {
            title: "Como Começar a Reciclar",
            summary: "Reciclar é mais do que uma ação ambiental; é um compromisso com o futuro do nosso planeta.",
            link: "https://convale.ce.gov.br/informa/54/cinco-dicas-para-voce-comecar-a-reciclar"
        },
        {
            title: "Isopor é Reciclável!",
            summary: "Composto por 98% de ar e 2% de poliestireno expandido, o EPS Isopor® é um material 100% reciclável.",
            link: "https://www.mundoisopor.com.br/sustentabilidade/dicas-de-reciclagem"
        },
        {
            title: "As Cores da Coleta Seletiva",
            summary: "As cores da coleta seletiva são uma importante ferramenta para a melhor destinação do lixo.",
            link: "https://www.ecycle.com.br/cores-da-coleta-seletiva/"
        },
        {
            title: "Aproveite o Lixo Orgânico",
            summary: "Restos de alimentos podem ser transformados em adubo para plantas, reduzindo o desperdício.",
            link: "https://www.mundoisopor.com.br/sustentabilidade/dicas-de-reciclagem"
        },
        {
            title: "Descarte de Eletrônicos",
            summary: "Equipamentos eletrônicos devem ser descartados em pontos de coleta específicos para evitar contaminação ambiental.",
            link: "https://www.mundoisopor.com.br/sustentabilidade/dicas-de-reciclagem"
        },
        {
            title: "Higienize as Embalagens",
            summary: "Antes de descartar, lave as embalagens para evitar contaminação e proliferação de fungos e bactérias.",
            link: "https://www.mundoisopor.com.br/sustentabilidade/dicas-de-reciclagem"
        }
    ];



    constructor(public layoutService: LayoutService, public router: Router) {
    }

}
