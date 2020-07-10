import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { ToastsService } from './toasts.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: User; // Save logged in user data
  isLogged: boolean;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public toastService: ToastsService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });

    this.isLogged = this.isLoggedIn;
  }

  // // Sign in with email/password
  // async SignIn(email, password) {
  //   console.log(email, password);
  //   await this.afAuth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       if (result.user) {
  //         localStorage.setItem('user', JSON.stringify(result.user));
  //         console.log('POR QUÉ SI LLEGO HASTA AQUÍ SE VUELVE A REINICIAR????');
  //       } else {
  //         this.toastService.toastLoginFail2(result);
  //       }
  //     })
  //     .catch((error) => {
  //       this.toastService.toastLoginFail2(error);
  //     });

  //   this.router.navigateByUrl('');
  // }

  //   async login(email: string, password: string) {
  //     var result = await this.afAuth.signInWithEmailAndPassword(email, password)
  //     this.router.navigate(['admin/list']);
  // }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        this.isLogged = this.isLoggedIn;
        this.ngZone.run(() => {
          this.router.navigate(['productos']).then(() => {
          //  window.location.reload();
            this.toastService.toastLoginSucces();
          });
        });
      })
      .catch((error) => {
        this.toastService.toastLoginFail2(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.isLogged = this.isLoggedIn;
      this.router.navigate(['login']);
    });
  }
}
