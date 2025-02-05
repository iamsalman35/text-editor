import { Component } from '@angular/core';
import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { ServicesComponent } from './services/services.component';

@Component({
  selector: 'app-root',
  imports: [NavigationBarComponent, ServicesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'conceptile-editor';
}
