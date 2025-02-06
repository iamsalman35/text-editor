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
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { History } from '../utils';
import { historiesSubscription } from '../utils';

@Component({
  selector: 'app-service-find-replace',
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzGridModule,
    NzToolTipModule,
    NzTypographyModule
  ],
  templateUrl: './service-find-replace.component.html',
  styleUrl: './service-find-replace.component.css',
})
export class ServiceFindReplaceComponent {
  findWord: string | null = null;
  wordOccurrences: number = 0;
  replaceWord: string | null = null;
  textValue: string | null = null;
  findExact = false;
  findRegEx = false;
  replaceNext = false;
  replaceAll = false;
  updatedText: string | null = null;
  @Input() findAndReplaceModal = false;
  @Output() findAndReplaceClosed: EventEmitter<any> = new EventEmitter();
  histories: History[];
  historyModal: boolean = false;
  historyOriginalText: string | undefined = undefined;
  historyUpdatedText: string | undefined = undefined;
  historyDate: string | undefined = undefined;
  
  constructor(private sanitizer: DomSanitizer) {
    this.histories = historiesSubscription;
  }

  closeModal(modal?: string): void {
    if(modal === 'history'){
      this.historyModal = false;
    }
    else{
      this.findAndReplaceModal = false;
      this.clearForm();
      this.findAndReplaceClosed.emit();
    }
  }

  getUpdatedString() {
    this.updatedText = this.textValue;
  }

  replaceText() {
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
      this.histories = [...this.histories, {
        originalText: this.textValue,
        updatedText: this.updatedText,
        timeStamp: new Date(Date.now()).toISOString().replace('T', ' ').substring(0, 16),
      }]
      let modifiedText = this.updatedText;
      let regex;
      regex = this.findRegEx? new RegExp(this.findWord, 'g'): this.findExact? new RegExp(`\\b${this.findWord}\\b`, 'g'): new RegExp(this.findWord, 'gi');
      this.textValue = modifiedText.replace(regex, (match) => `${this.replaceWord}`
      );
      this.updatedText = this.textValue;
      const element = document.getElementById('updated-text');
      if (element) {
        element.innerHTML = this.textValue;
      }
      this.wordOccurrences = 0;
      this.findWord = null;
    }
  }

  highlightFindAndReplaceAll(word: string){
    if (this.findWord && this.replaceWord) {
      return `<span nz-typography><del><mark>${word}</mark></del></span> &nbsp;<span nz-typography><strong>${this.replaceWord}</strong></span>`
    }
    return `<span nz-typography><mark>${word}</mark></span>`
  }

  findWithoutRegEx(modifiedText: string): string {
      if (!this.findWord) { return ""; }
      const regex = this.findExact? new RegExp(`\\b${this.findWord}\\b`, 'g'): new RegExp(this.findWord, 'gi');

      return (modifiedText = modifiedText.replace(regex, (match, offset) => {
        this.wordOccurrences++;
        return this.highlightFindAndReplaceAll(match);
      }));
  }

  findUsingRegEx(modifiedText: string): string {
    if(!this.findWord){ return ""; }
    const regex = new RegExp(this.findWord, 'g');
    return (modifiedText = modifiedText.replace(regex, (match, offset) => {
      this.wordOccurrences++;
      return this.highlightFindAndReplaceAll(match);
    }));
  }

  findText(): SafeHtml {
    this.wordOccurrences = 0;
    if (!this.updatedText) return '';

    let modifiedText = this.updatedText;
      if (this.findWord) {
        if (!this.findRegEx) {
          modifiedText = this.findWithoutRegEx(modifiedText);
        } else {
          modifiedText = this.findUsingRegEx(modifiedText);
        }
      }
    return this.sanitizer.bypassSecurityTrustHtml(modifiedText);
  }

  showHistory(history: any){
    this.historyModal = true;
    this.historyOriginalText = history.originalText;
    this.historyUpdatedText = history.updatedText;
    this.historyDate = history.timeStamp;
  }

  clearForm(){
    this.textValue = null;
    this.updatedText = null;
    this.findWord = null;
    this.replaceWord = null;
  }
}