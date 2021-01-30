import { Component, OnDestroy, OnInit } from '@angular/core';
import { Medico } from '../../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private medicoServ: MedicoService,
              private modalImagenServ: ModalImagenService,
              private busquedasServ: BusquedasService) { }
 

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenServ.nuevaImagen
                        .pipe( delay(100))
                        .subscribe( img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoServ.cargarMedicos().subscribe(
      medicos => {
        this.cargando = false;
        this.medicos = medicos;        
      }
    )

  }

  abrirModal(medico: Medico){
    this.modalImagenServ.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string){

    if (termino.length === 0) {
      return this.cargarMedicos();      
    }

    this.busquedasServ.buscar('medicos',termino).subscribe(
      resp => {        
        this.medicos = <Medico[]>resp;
      }
    );
  }

  borrarMedico(medico: Medico){
    Swal.fire(
      {
        title: '¿Borrar médico?',
        text: `Esta a punto de borrar a ${ medico.nombre }`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrarlo',        
      }
    ).then(
      (result) => {
        if(result.value){
          this.medicoServ.borrarMedico(medico._id).subscribe(
            resp => {
              this.cargarMedicos();

              Swal.fire({
                title: 'Médico borrado',
                text: `${ medico.nombre } fue eliminado con éxito`,
                icon: 'success'
              });              
            }
          );
        }
      }
    );
  }

}
