import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }



  uploadImages(files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file, `image-${index}-${file.name}`);
    });

    return this.http.post<string[]>(`${environment.api}/upload/upload-images`, formData);
  }
}
