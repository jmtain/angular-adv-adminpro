import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../../models/medico.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

 public medicoForm: FormGroup;
 public hospitales: Hospital[] = [];
 public medicoSeleccionado: Medico;
 public hospitalSeleccionado: Hospital;


  constructor(private fb: FormBuilder,
              private hospitalServ: HospitalService,
              private medicoServ: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { 
                
              }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(
      ({ id }) => { 
        this.cargarMedico(id);
      }
    );

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();
    this.medicoForm.get('hospital').valueChanges.subscribe(
      hospitalId => {
        this.hospitalSeleccionado= this.hospitales.find( h => h._id === hospitalId);
      }
    );
  }
  
  cargarMedico(id: string){
      if( id === 'nuevo' ) {
        return;        
      }

      this.medicoServ.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
        .subscribe(
        medico => {  
          if ( !medico ) {
            return this.router.navigateByUrl(`/dashboard/medicos`);
          }        
          const { nombre, hospital:{ _id } } = medico;             
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({nombre, hospital: _id });                    
        }
      );
  }

  cargarHospitales(){
    this.hospitalServ.cargarHospitales().subscribe(
      (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      }
    )
  }

  guardarMedico(){    
    const { nombre } = this.medicoForm.value;

    if( this.medicoSeleccionado ) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoServ.actualizarMedico(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${ nombre } actualizado con éxito`,'success');
        }
      );
    } 
    else {

      this.medicoServ.crearMedico(this.medicoForm.value).subscribe(
        (resp: any ) => {          
          Swal.fire('Creado', `${ nombre } creado con éxito`,'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id}`);
        }
      );
    }

  }





}
