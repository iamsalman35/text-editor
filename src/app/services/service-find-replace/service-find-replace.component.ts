import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-find-replace',
  imports: [CommonModule, NzButtonModule, NzModalModule, NzLayoutModule, NzMenuModule, FormsModule, NzButtonModule, NzInputModule, NzIconModule, NzGridModule, NzToolTipModule],
  templateUrl: './service-find-replace.component.html',
  styleUrl: './service-find-replace.component.css'
})
export class ServiceFindReplaceComponent {
  findWord: string | null = null;
  wordOccurrences : number = 0;
  replaceWord: string | null = null;
  inputValue: string | null = null;
  textValue: string | null = null;
  findExact = false; findRegEx = false; replaceNext = false; replaceAll = false;
  goPrev: string | null = null; goNext: string | null = null;
  updatedText: string | null = null;
  @Input() findAndReplaceModal = false;
  @Output() findAndReplaceClosed : EventEmitter<any> = new EventEmitter();;

  handleOkMiddle(): void {
    this.findAndReplaceModal = false;
    this.findAndReplaceClosed.emit();
  }

  handleCancelMiddle(): void {
    this.findAndReplaceModal = false;
    this.findAndReplaceClosed.emit();
  }

  getUpdatedString(){
    this.updatedText = this.textValue;
    console.log(this.updatedText)
  }

  toggleWord(method: string){

  }

  replaceText(){
    this.replaceAll = !this.replaceAll; 
    this.replaceNext = false;
    const icon = document.querySelector('.selected-btn-instant');
    if (icon) {
      icon.classList.add('clicked');
      setTimeout(() => {
        icon.classList.remove('clicked');
      }, 300); 
    }
    if (this.findWord && this.updatedText) {
      let modifiedText = this.updatedText;
      const regex = this.findExact? new RegExp(`\\b${this.findWord}\\b`, 'g'): new RegExp(this.findWord, 'gi');
      //ADD HISTORY HERE
      //CHANGE ORIGINAL TEXT
      this.textValue = modifiedText.replace(regex, match => `${this.replaceWord}`);
      this.updatedText = this.textValue;
      const element = document.getElementById('updated-text');
      if (element) {
        element.innerHTML = this.textValue;
      }
      this.wordOccurrences  = 0;
      this.findWord = null;
    }
  }

  findText(): string {
    this.wordOccurrences = 0;
    if (!this.updatedText) return '';
  
    let modifiedText = this.updatedText;
    let regex: RegExp;
  
    if (this.findWord) {
      try {
        if (this.findRegEx) {
          regex = new RegExp(this.findWord, 'g'); 
        } else {
          regex = this.findExact 
            ? new RegExp(`\\b${this.findWord}\\b`, 'g') 
            : new RegExp(this.findWord, 'gi');
        }
        
        modifiedText = modifiedText.replace(regex, match => {
          this.wordOccurrences++;
          if (this.findWord && this.replaceWord) {
            return `<span nz-typography><del><mark>${match}</mark></del></span> &nbsp;<span nz-typography><strong>${this.replaceWord}</strong></span>`;
          }
          return `<span nz-typography><mark>${match}</mark></span>`;
        });
  
      } catch (error) {
        console.error("Invalid regex provided:", error);
        return modifiedText;
      }
    }
  
    return modifiedText;
  }
  
  
}
