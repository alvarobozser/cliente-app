import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title='Inicio';

  constructor(
    public authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  logout():void{
    this.authService.logout();
    swal('Logout','Has cerrado la sesión','success');
    this.router.navigate(['/login']);
  }
}
