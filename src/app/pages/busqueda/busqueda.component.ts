import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../../models/usuario.model';
import { Medico } from '../../../models/medico.model';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private busquedasServ: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      ({ termino }) => {
        this.busquedaGlobal(termino);        
      }
    )
  }

  busquedaGlobal(termino: string ){
    this.busquedasServ.busquedaGlobal(termino).subscribe(
      (resp: any ) => {        
        this.usuarios = resp.usuarios;
        this.medicos = resp.medicos;
        this.hospitales = resp.hospitales;
      }
    );
  }

}
