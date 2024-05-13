import { Injectable, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';

// // Import the CloudinaryModule.
// import { CloudinaryModule } from '@cloudinary/ng';

// // Import the Cloudinary classes.
// import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadImgService {
  // apiUrlUser: string = `${environment.API}/user`;

  constructor(private http: HttpClient) {}

  uploadImage(image: File): Promise<string> {
    const formData: FormData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'EcoColeta_imgs'); // Substitua 'your_preset_here' pelo seu preset do Cloudinary

    //TODO verificar variaveis de ambiente e api key, fazer com seguança
    return this.http
      .post<any>(
        'https://api.cloudinary.com/v1_1/cloudalguipires/image/upload',
        formData
      )
      .toPromise()
      .then((response) => response.url)
      .catch((error) => {
        console.error('There was an error uploading the image', error);
        return '';
      });
  }
}
