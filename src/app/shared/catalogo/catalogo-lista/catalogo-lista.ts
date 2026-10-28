import { Component, computed, inject, input, signal } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { aApiError } from '../../../core/http/api-error';
import { FormularioModal } from '../../ui/formulario-modal';
import { CatalogoForm, CatalogoFormData } from '../catalogo-form/catalogo-form';
import { CatalogoStore } from '../catalogo.store';
import { ElementoCatalogo } from '../elemento-catalogo';

/** Textos propios de cada catálogo (con el género gramatical correcto). */
export interface TextosCatalogo {
  titulo: string;
  subtitulo: string;
  /** p. ej. `Nueva materia` */
  nuevo: string;
  /** p. ej. `Editar materia` */
  editar: string;
  registrado: string;
  actualizado: string;
  eliminado: string;
  confirmarEliminar: string;
  /** Mensaje para el 409 del backend al eliminar un elemento usado en tratamientos. */
  enUso: string;
  /** Ejemplo de descripción para el formulario. */
  ejemplo: string;
}

/** Página CRUD genérica de un catálogo: búsqueda, tabla y formulario en modal. */
@Component({
  selector: 'app-catalogo-lista',
  imports: [
    NzAlertModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzPopconfirmModule,
    NzTableModule,
    NzTooltipModule,
  ],
  template: `
    <nz-page-header [nzTitle]="textos().titulo" [nzSubtitle]="textos().subtitulo">
      <nz-page-header-extra>
        <button nz-button nzType="primary" (click)="nuevo()">
          <nz-icon nzType="plus" /> {{ textos().nuevo }}
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="toolbar">
      <nz-input-wrapper class="toolbar-search">
        <nz-icon nzInputPrefix nzType="search" />
        <input
          nz-input
          placeholder="Buscar por descripción"
          [value]="busqueda()"
          (input)="busqueda.set($any($event.target).value)"
        />
      </nz-input-wrapper>
      <button nz-button (click)="store().cargar()" [nzLoading]="store().cargando()">
        <nz-icon nzType="reload" /> Actualizar
      </button>
    </div>

    @if (store().error(); as error) {
      <nz-alert nzType="error" nzShowIcon [nzMessage]="error" class="form-alert" />
    }

    <nz-table
      #tabla
      [nzData]="filtrados()"
      [nzLoading]="store().cargando()"
      [nzPageSize]="10"
      nzSize="middle"
    >
      <thead>
        <tr>
          <th>Descripción</th>
          <th nzWidth="110px">Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (e of tabla.data; track e.id) {
          <tr>
            <td>{{ e.descripcion }}</td>
            <td>
              <a (click)="editar(e)" nz-tooltip nzTooltipTitle="Editar"
                ><nz-icon nzType="edit"
              /></a>
              <nz-divider nzType="vertical" />
              <a
                class="danger"
                nz-popconfirm
                [nzPopconfirmTitle]="textos().confirmarEliminar"
                nzOkText="Eliminar"
                nzOkDanger
                (nzOnConfirm)="eliminar(e)"
              >
                <nz-icon nzType="delete" />
              </a>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  `,
})
export class CatalogoLista<T extends ElementoCatalogo> {
  readonly store = input.required<CatalogoStore<T>>();
  readonly textos = input.required<TextosCatalogo>();

  private readonly modal = inject(FormularioModal);
  private readonly message = inject(NzMessageService);

  protected readonly busqueda = signal('');
  protected readonly filtrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    const elementos = this.store().elementos();
    return termino
      ? elementos.filter((e) => e.descripcion.toLowerCase().includes(termino))
      : elementos;
  });

  protected async nuevo(): Promise<void> {
    const creado = await this.modal.abrir(CatalogoForm, this.textos().nuevo, {
      ejemplo: this.textos().ejemplo,
      guardar: (datos) => this.store().crear(datos),
    } satisfies CatalogoFormData);
    if (creado) this.message.success(this.textos().registrado);
  }

  protected async editar(elemento: T): Promise<void> {
    const actualizado = await this.modal.abrir(CatalogoForm, this.textos().editar, {
      ejemplo: this.textos().ejemplo,
      registro: elemento,
      guardar: (datos) => this.store().actualizar(elemento.id, datos),
    } satisfies CatalogoFormData);
    if (actualizado) this.message.success(this.textos().actualizado);
  }

  protected async eliminar(elemento: T): Promise<void> {
    try {
      await this.store().eliminar(elemento.id);
      this.message.success(this.textos().eliminado);
    } catch (e) {
      const error = aApiError(e);
      this.message.error(error.status === 409 ? this.textos().enUso : error.message);
    }
  }
}
