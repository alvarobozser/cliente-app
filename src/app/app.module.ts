import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RoleGuardGuard } from './guards/role-guard.guard';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DirectivaComponent } from './components/directiva/directiva.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { DetailComponent } from './components/clientes/detail/detail.component';
import { FormComponent } from './components/clientes/form-client/form.component';
import { ClienteService } from './components/clientes/services/cliente.service';

registerLocaleData(localeES,'es');

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent ,canActivate:[RoleGuardGuard],data:{role:'ROLE_ADMIN'}},
  { path: 'clientes/form/:id', component: FormComponent,canActivate:[RoleGuardGuard],data:{role:'ROLE_ADMIN'}},
  { path: 'login', component: LoginComponent },
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [ClienteService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
