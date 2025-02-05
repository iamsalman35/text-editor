import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { ServiceFindReplaceComponent } from "./service-find-replace/service-find-replace.component";

@Component({
  selector: 'app-services',
  imports: [CommonModule, NzCardModule, NzIconModule, NzButtonModule, ServiceFindReplaceComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  featureSize: NzButtonSize = 'small';
  openFindReplace = false;
  services = [
    {serviceName: 'Find & Replace Tool', serviceShortDesc: 'Find and Replace single or multiple occurences of text.', features: ['Autosave', 'Count Occurences', 'Regex Support', 'History of Replacements'], functionName: 'frl', icon: 'plus-circle', active: true},
    {serviceName: 'Text Comparator', serviceShortDesc: 'Compare two different texts and get various insights', features: ['Show Hits in Green', 'Show Misses in Red', 'History of Comparisons'], functionName: 'tcr', icon: 'question-circle', active: false}
  ]

  openFindReplaceModal(service: string){
    if(service == 'frl'){
      this.openFindReplace = true;
    }
    else if(service == 'tcr'){
    }
  }
}
