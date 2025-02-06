import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { ServiceFindReplaceComponent } from "./service-find-replace/service-find-replace.component";
import { Service } from './utils';
import { servicesSubscription } from './utils';

@Component({
  selector: 'app-services',
  imports: [CommonModule, NzCardModule, NzIconModule, NzButtonModule, ServiceFindReplaceComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  featureSize: NzButtonSize = 'small';
  openFindReplace = false;
  services: Service[];

  constructor(){
    this.services = servicesSubscription;
  }

  openFindReplaceModal(service: string){
    if(service == 'frl'){
      this.openFindReplace = true;
    }
    else if(service == 'tcr'){
      //Not Implemented, exists only as a placeholder
    }
  }
}
