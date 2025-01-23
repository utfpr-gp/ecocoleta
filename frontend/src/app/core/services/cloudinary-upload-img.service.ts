import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from "primeng/api";


@Injectable({
    providedIn: 'root',
})
export class CloudinaryUploadImgService {

    constructor(private http: HttpClient,
                private messageService: MessageService) {
    }

    // CLOUDINARY HTTP
    async uploadImage(image: File): Promise<string> {

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'EcoColeta_imgs');
        formData.append('cloud_name', 'cloudalguipires');

        try {
            const response = await this.http.post<any>(
                'https://api.cloudinary.com/v1_1/cloudalguipires/image/upload',
                formData
            ).toPromise();

            return response.secure_url;
        } catch (error: any) {
            console.error('Erro ao fazer o upload para o Cloudinary:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao fazer o upload para o Cloudinary: ' + error.message,
            });
            throw new Error('Erro ao fazer o upload');
        }
    }

    convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }
}
