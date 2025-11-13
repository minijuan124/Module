import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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


  users$ = this.usersSubject.asObservable();

  addUser(user: User) {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
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
