import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalServ: HospitalService,
              private modalImagenServ: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenServ.nuevaImagen
                        .pipe( delay(100))
                        .subscribe( img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(){
    this.cargando=true;

    this.hospitalServ.cargarHospitales().subscribe(
      hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      }
    )
  }

  guardarCambios(hospital: Hospital){
    this.hospitalServ.actualizarHospital(hospital._id, hospital.nombre).subscribe(
      resp => {
        this.cargarHospitales();
        Swal.fire('Actualizado',hospital.nombre, 'success');
      }
    );
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalServ.borrarHospital(hospital._id).subscribe(
      resp => {
        this.cargarHospitales();
        Swal.fire('Borrado',hospital.nombre, 'success');
      }
    );
  }

  async abrirSweetAlert(){
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre dle nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if ( value.trim().length > 0){
      this.hospitalServ.crearHospital(value).subscribe(
        (resp: any ) => { 
          this.hospitales.push(resp.hospital);
        }
      )
    }
  
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenServ.abrirModal('hospitales', hospital._id, hospital.img);
  }

  buscar(termino: string){

    if (termino.length === 0) {
      return this.cargarHospitales();      
    }

    this.busquedasService.buscar('hospitales',termino).subscribe(
      resp => {        
        this.hospitales = <Hospital[]>resp;
      }
    );
  }

}
