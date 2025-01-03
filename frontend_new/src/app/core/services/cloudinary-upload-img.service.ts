import { Injectable, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { v2 as cloudinary } from 'cloudinary';
import {MessageService} from "primeng/api";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL, StorageError} from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyBbEUO3ZyxOhuHK3Nq0PueDIkx3MdxZimU",
//     authDomain: "ecocoleta-ca088.firebaseapp.com",
//     projectId: "ecocoleta-ca088",
//     storageBucket: "ecocoleta-ca088.firebasestorage.app",
//     messagingSenderId: "262565900223",
//     appId: "1:262565900223:web:d8a2f6cddacf1ec3e67b0a",
//     measurementId: "G-0B3M18LNFW"
// };

@Injectable({
  providedIn: 'root',
})
export class CloudinaryUploadImgService {

  // apiUrlUser: string = `${environment.API}/user`;
  //   CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@cloudalguipires

  constructor(private http: HttpClient,
              private messageService: MessageService) {

      // initializeApp(firebaseConfig);
      // getAnalytics(app); // Optional: Initialize Analytics (if you're using it)

      // // Get a reference to the storage service
      // const storage = getStorage(app);

      // // Configuration
      // cloudinary.config({
      //     cloud_name: 'cloudalguipires',
      //     api_key: '883712328676881',
      //     api_secret: '8w3cNG1gwHnQ8yt4Lt31sFNgad0' // Click 'View API Keys' above to copy your API secret
      // });
  }


    // // CLOUDINARY
    // async uploadImage(image: File): Promise<string> {
    //     const formData = new FormData();
    //     formData.append('file', image); // Adiciona o arquivo selecionado
    //     formData.append('upload_preset', 'EcoColeta_imgs'); // Configure no Cloudinary
    //     try {
    //
    //         return this.http
    //             .post<any>(
    //                 'https://api.cloudinary.com/v1_1/cloudalguipires/image/upload',
    //                 formData
    //             )
    //             .toPromise()
    //             .then((response) => response.url)
    //     } catch (error) {
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Erro',
    //             detail: 'Erro na comunicação com o Cloudinary: ' + error,
    //         });
    //         console.error('Erro na comunicação com o Cloudinary:', error); //TODO remover apos teste
    //         return '';
    //     }
    // }

    //FIREBASE STORAGE
    // async uploadImage(image: File): Promise<string> {
    //     try {
    //         const storage = getStorage(); // Obtém a instância do Storage dentro da função
    //         const storageRef = ref(storage, `images/${image.name}`);
    //
    //         const uploadTask = uploadBytesResumable(storageRef, image);
    //
    //         return new Promise<string>((resolve, reject) => { // Retorna uma nova Promise
    //             uploadTask.on('state_changed',
    //                 (snapshot) => {
    //                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                     console.log('Upload is ' + progress + '% done');
    //                 },
    //                 (error: StorageError) => { // Tipagem do erro para StorageError
    //                     console.error('Error uploading image:', error);
    //                     this.messageService.add({
    //                         severity: 'error',
    //                         summary: 'Erro',
    //                         detail: 'Erro ao enviar a imagem: ' + error.message,
    //                     });
    //                     reject(error.message); // Rejeita a Promise em caso de erro
    //                 },
    //                 () => {
    //                     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                         console.log('Image uploaded successfully:', downloadURL);
    //                         resolve(downloadURL); // Resolve a Promise com a URL de download
    //                     }).catch(error => { // Captura erros no getDownloadURL também
    //                         console.error("Erro ao obter URL de download:", error);
    //                         this.messageService.add({
    //                             severity: 'error',
    //                             summary: 'Erro',
    //                             detail: 'Erro ao obter URL da imagem: ' + error.message,
    //                         });
    //                         reject(error.message);
    //                     });
    //                 }
    //             );
    //         });
    //     } catch (error) {
    //         console.error('Unexpected error:', error);
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Erro',
    //             detail: 'Erro inesperado: ' + error.message,
    //         });
    //         return Promise.reject(error.message); // Rejeita a Promise em caso de erro no try/catch externo
    //     }
    // }
}
