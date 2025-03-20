import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'dms-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  collapsed = true;
  currentPage: string = '';
  @Output() isAuth =  new EventEmitter<boolean>();

  constructor(private router: Router, private authService : AuthService) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Ottieni il percorso attuale e estraici il nome della pagina
      this.currentPage = this.getPageName(event.url);
      if (this.currentPage == "Auth") { 
        this.isAuth.emit(true);
      }
      else {
        this.isAuth.emit(false);     
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }
  
    // Metodo per aprire la modale laterale
    openAppDrawer() {
      const appDrawer = new (window as any).bootstrap.Offcanvas(document.getElementById('appDrawer'));
      appDrawer.show();
    }

  // Metodo per estrarre il nome della pagina dal percorso
  getPageName(url: string): string {
    const urlSegments = url.split('/');
    let pageName = urlSegments[urlSegments.length - 1];
  
    // Controllo se la prima lettera è minuscola
    if (pageName && pageName.length > 0 && pageName[0] === pageName[0].toLowerCase()) {
      // Converto la prima lettera in maiuscolo
      pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
  
    return pageName;
  }

}
