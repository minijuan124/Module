import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface User {
  cod_usuario: string;
  nomb_usuario: string;
  banco: string;
  estatus: 'A' | 'I' | 'E';
  perfiles: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);

  // Banks store
  private banksSubject = new BehaviorSubject<any[]>([]);
  banks$ = this.banksSubject.asObservable();

  // Profiles store
  private profilesSubject = new BehaviorSubject<any[]>([]);
  profiles$ = this.profilesSubject.asObservable();


  users$ = this.usersSubject.asObservable();

  addUser(user: User) {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }

  /**
   * Consulta todos los usuarios desde el endpoint especificado en la API SIGIC
   * y actualiza el store local `usersSubject`.
   */
  fetchAllUsers(): Observable<User[]> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: '',
        action: 'Get-all-User'
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/accesos/get-all-users`, payload).pipe(
      map(resp => {
        const usuarios = resp?.usuarios ?? [];
        const mapped: User[] = usuarios.map((u: any) => ({
          cod_usuario: u.codigoUsuario,
          nomb_usuario: u.nombreUsuario,
          banco: String(u.empresaUsuario ?? ''),
          estatus: (u.estatusUsuario ?? 'A') as 'A' | 'I' | 'E',
          perfiles: u.codigoPerfilAsociado ? [String(u.codigoPerfilAsociado)] : []
        }));
        // actualizar el BehaviorSubject con la lista obtenida
        this.usersSubject.next(mapped);
        return mapped;
      })
    );
  }

  /**
   * Consulta todos los bancos desde la API SIGIC y actualiza el store local `banksSubject`.
   */
  fetchAllBanks(): Observable<any[]> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: '',
        action: 'Get-All-Banks'
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/banco/get-all-banks`, payload).pipe(
      map(resp => {
        const bancos = resp?.bancosDisponibles ?? [];
        // Map to objects with codigoABA and descripcion
        const mapped = bancos.map((b: any) => ({ codigoABA: b.codigoABA, descripcion: b.descripcion }));
        this.banksSubject.next(mapped);
        return mapped;
      })
    );
  }

  /**
   * Consulta todos los perfiles desde la API SIGIC y actualiza el store local `profilesSubject`.
   */
  fetchAllProfiles(): Observable<any[]> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: '',
        action: 'Get-All-Profiles'
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/perfil/get-all-profiles`, payload).pipe(
      map(resp => {
        const perfiles = resp?.perfilesDisponibles ?? [];
        const mapped = perfiles.map((p: any) => ({ codigoPerfil: String(p.codigoPerfil), descripcion: p.descripcion }));
        this.profilesSubject.next(mapped);
        return mapped;
      })
    );
  }

  private apiBase = 'http://localhost:8090';

  constructor(private http: HttpClient, private auth: AuthService) {}

  createUser(payloadInput: any): Observable<User> {
    // registrar user (who performs the action)
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';

    // Build API envelope according to the PDF specification
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: payloadInput.ipClient ?? '',
        action: 'Insert-User'
      },
      bodyEntrada: {
        codigoUsuario: payloadInput.cod_usuario,
        nombreUsuario: payloadInput.nomb_usuario,
        empresaUsuario: payloadInput.empresaUsuario ?? payloadInput.banco ?? 105,
        estatusUsuario: payloadInput.estatus ?? 'A',
        codigoUsuarioRegistra: payloadInput.codigoUsuarioRegistra ?? registrar,
        codigoPerfilAsociado: payloadInput.codigoPerfilAsociado ?? (Array.isArray(payloadInput.perfiles) && payloadInput.perfiles.length ? payloadInput.perfiles[0] : 1),
        clave: payloadInput.clave ?? ''
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/accesos/insert-user`, payload).pipe(
      map(resp => {
        // Map API response (or fallback to sent payload) to internal User shape
        const created: User = {
          cod_usuario: resp?.bodyEntrada?.codigoUsuario ?? resp?.codigoUsuario ?? payload.bodyEntrada.codigoUsuario,
          nomb_usuario: resp?.bodyEntrada?.nombreUsuario ?? resp?.nombreUsuario ?? payload.bodyEntrada.nombreUsuario,
          banco: String(payload.bodyEntrada.empresaUsuario ?? payloadInput.banco ?? ''),
          estatus: (resp?.bodyEntrada?.estatusUsuario ?? resp?.estatus ?? payload.bodyEntrada.estatusUsuario) as 'A' | 'I' | 'E',
          perfiles: payloadInput.perfiles ?? [String(payload.bodyEntrada.codigoPerfilAsociado)]
        };
        return created;
      }),
      tap(created => this.addUser(created))
    );
  }

  /**
   * Actualiza un usuario en la API SIGIC y actualiza el store local `usersSubject`.
   */
  updateUserRemote(payloadInput: any): Observable<any> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    // Build bodyEntrada dynamically: only include banco/clave if provided by the form
    const bodyEntrada: any = {
      codigoUsuario: payloadInput.cod_usuario,
      nombreUsuario: payloadInput.nomb_usuario,
      estatusUsuario: payloadInput.estatus ?? 'A',
      codigoUsuarioRegistra: payloadInput.codigoUsuarioRegistra ?? registrar,
      codigoPerfilAsociado: payloadInput.codigoPerfilAsociado ?? (Array.isArray(payloadInput.perfiles) && payloadInput.perfiles.length ? payloadInput.perfiles[0] : 1)
    };

    // Prefer the `banco` field from the form when present (it's the select the user changes).
    if (payloadInput.banco !== undefined && payloadInput.banco !== null) {
      bodyEntrada.empresaUsuario = payloadInput.banco;
    } else if (payloadInput.empresaUsuario !== undefined && payloadInput.empresaUsuario !== null) {
      bodyEntrada.empresaUsuario = payloadInput.empresaUsuario;
    }

    // Only include password if explicitly provided (non-empty)
    if (payloadInput.clave) {
      bodyEntrada.clave = payloadInput.clave;
    }

    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: payloadInput.ipClient ?? '',
        action: 'Update-User'
      },
      bodyEntrada
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/accesos/update-user`, payload).pipe(
      map(resp => {
        // Si la actualización fue exitosa, actualizar el store local con los nuevos valores
        const current = this.usersSubject.value.map(u =>
          u.cod_usuario === payloadInput.cod_usuario
            ? ({
                ...u,
                nomb_usuario: payloadInput.nomb_usuario ?? u.nomb_usuario,
                // preserve existing banco unless the form provided a new one
                banco: bodyEntrada.empresaUsuario !== undefined ? String(bodyEntrada.empresaUsuario) : u.banco,
                estatus: (bodyEntrada.estatusUsuario ?? 'A') as 'A' | 'I' | 'E',
                perfiles: payloadInput.perfiles ?? [String(bodyEntrada.codigoPerfilAsociado)]
              } as User)
            : u
        );
        this.usersSubject.next(current);
        return resp;
      })
    );
  }

  /**
   * Elimina lógicamente un usuario en la API SIGIC y marca el usuario en el store con estatus 'E'.
   */
  deleteUserRemote(codigoUsuario: string): Observable<any> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: '',
        action: 'Delete-User'
      },
      bodyEntrada: {
        codigoUsuario: codigoUsuario,
        codigoUsuarioRegistra: registrar
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/accesos/delete-user`, payload).pipe(
      map(resp => {
        // Si la llamada fue exitosa, marcamos el usuario en el store como eliminado (estatus 'E')
        const current = this.usersSubject.value.map(u =>
          u.cod_usuario === codigoUsuario ? { ...u, estatus: 'E' as 'A' | 'I' | 'E' } : u
        );
        this.usersSubject.next(current);
        return resp;
      })
    );
  }

  /**
   * Actualiza la contraseña de un usuario (Admin action).
   */
  updatePasswordRemote(codigoUsuario: string, nuevaClave: string, claveActual: string = ''): Observable<any> {
    const registrar = this.auth.currentUser()?.username?.toUpperCase() ?? 'ADMIN';
    const payload = {
      infoMsg: {
        guId: this.generateGuid(),
        applId: 'SIGIC',
        userId: registrar,
        ipClient: '',
        action: 'Update-Password'
      },
      bodyEntrada: {
        codigoUsuario: codigoUsuario,
        codigoUsuarioRegistra: registrar,
        claveActual: claveActual,
        claveNueva: nuevaClave
      }
    };

    return this.http.post<any>(`${this.apiBase}/api-sigic/accesos/update-password`, payload).pipe(
      map(resp => resp)
    );
  }

  private generateGuid() {
    // simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  updateUser(user: User) {
    const current = this.usersSubject.value.map(u =>
      u.cod_usuario === user.cod_usuario ? user : u
    );
    this.usersSubject.next(current);
  }

  deleteUser(cod_usuario: string) {
    const current = this.usersSubject.value.filter(u => u.cod_usuario !== cod_usuario);
    this.usersSubject.next(current);
  }

  getUser(cod_usuario: string): User | undefined {
    return this.usersSubject.value.find(u => u.cod_usuario === cod_usuario);
  }
}
