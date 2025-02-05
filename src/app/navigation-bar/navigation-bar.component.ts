import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-navigation-bar',
  imports: [NzIconModule, NzMenuModule, NzButtonModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
  size: NzButtonSize = 'large';
}
