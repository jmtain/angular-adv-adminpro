import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
     headers:{
       'x-token': this.token
     }
   };
  }

  cargarHospitales(){
    const url = `${ base_url }/hospitales`;
    return this.http.get(url,this.headers).pipe(
      map( (resp: {ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
    );
  }

  crearHospital(nombre: string){
    const url = `${ base_url }/hospitales`;
    return this.http.post(url,{ nombre },this.headers);
  }

  actualizarHospital(_id: string, nombre: string){
    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.put(url,{ nombre },this.headers);
  }

  borrarHospital(_id: string){
    const url = `${ base_url }/hospitales/${ _id }`;
    return this.http.delete(url, this.headers);
  }
}
