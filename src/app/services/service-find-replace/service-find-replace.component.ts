import { Component, EventEmitter, Input, Output, AfterViewChecked, ChangeDetectorRef  } from '@angular/core';
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
export class ServiceFindReplaceComponent implements AfterViewChecked{
  findWord: string | null = null;
  wordOccurrences: number = 0;
  replaceWord: string | null = null;
  textValue: string | null = null;
  findExact = false;
  findRegEx = false;
  replaceAll = false;
  updatedText: string | null = null;
  @Input() findAndReplaceModal = false;
  @Output() findAndReplaceClosed: EventEmitter<any> = new EventEmitter();
  histories: History[];
  historyModal: boolean = false;
  historyOriginalText: string | undefined = undefined;
  historyUpdatedText: string | undefined = undefined;
  historyDate: string | undefined = undefined;
  
  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    this.histories = historiesSubscription;
  }

  //APIs for UI renders/re-renders
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
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

  replaceClickEffect(){
    const icon = document.querySelector('.selected-btn-instant');
    if (icon) {
      icon.classList.add('clicked');
      setTimeout(() => {
        icon.classList.remove('clicked');
      }, 300);
    }
  }

  highlightFindAndReplaceAll(word: string){
    if (this.findWord && this.replaceWord) {
      //If findWord and replaceWord exists, wrap the matched words in a strikethrough typography, followed by the 'to-be-replaced' word on the right, in bold.
      return `<span nz-typography><del><mark>${word}</mark></del></span> &nbsp;<span nz-typography><strong>${this.replaceWord}</strong></span>`
    }
    //Else only highlight the matched words
    return `<span nz-typography><mark>${word}</mark></span>`
  }

  //APIs for Find & Replace Functionality
  findWithoutRegEx(modifiedText: string): string {
      if (!this.findWord) { return ""; }
      //RegEx checker to differntiate between loose and right comparison of words
      const regex = this.findExact? new RegExp(`\\b${this.findWord}\\b`, 'g'): new RegExp(this.findWord, 'gi');

      //Traverse through the 'To-be-modified' text, apply regex, increment the word occurences and pass the matches to be highlighted.
      return (modifiedText = modifiedText.replace(regex, (match, offset) => {
        this.wordOccurrences++;
        return this.highlightFindAndReplaceAll(match);
      }));
  }

  findUsingRegEx(modifiedText: string): string {
    if(!this.findWord){ return ""; }
    //Incoming RegEx from the user, therefore too many checkers aren't necessary.
    const regex = new RegExp(this.findWord, 'g');

     //Traverse through the 'To-be-modified' text, apply regex, increment the word occurences and pass the matches to be highlighted.
    return (modifiedText = modifiedText.replace(regex, (match, offset) => {
      this.wordOccurrences++;
      return this.highlightFindAndReplaceAll(match);
    }));
  }

  findText(): SafeHtml {
    this.wordOccurrences = 0;
    if (!this.updatedText) return '';

    let modifiedText = this.updatedText;
    //Blocks for different possible input parameters
    if (this.findWord) {
      if (!this.findRegEx) {
        modifiedText = this.findWithoutRegEx(modifiedText);
      } else {
        modifiedText = this.findUsingRegEx(modifiedText);
      }
    }
    // Bypass Angular's security to safely render modified HTML content 
    return this.sanitizer.bypassSecurityTrustHtml(modifiedText);
  }

  replaceText() {
    this.replaceAll = !this.replaceAll;
    this.replaceClickEffect();
    let newString;
    
    if (this.findWord && this.updatedText) {
      //Determining regex pattern based on user inputs
      let modifiedText = this.updatedText;
      const regex = this.findRegEx? new RegExp(this.findWord, 'g'): this.findExact? new RegExp(`\\b${this.findWord}\\b`, 'g'): new RegExp(this.findWord, 'gi');
        //Replace occurences of the word in the text
        newString = modifiedText.replace(regex, (match) => `${this.replaceWord}`
      );
      //Combination of ngRx along with POST APIs can be used for efficient state management and saving data. There's a simplified version.
      this.saveHistories(newString);
    }
  }

  saveHistories(newString: string){
    if(this.textValue){
      this.histories = [{ originalText: this.textValue, updatedText: newString, timeStamp: new Date(Date.now()).toISOString().replace('T', ' ').substring(0, 16),
      }, ...this.histories]
      this.textValue = newString;
      this.updatedText = this.textValue;
      // Update the displayed text in the DOM
      const element = document.getElementById('updated-text');
      if (element) {
        element.innerHTML = this.textValue;
      }
      //Reset word occurences.
      this.wordOccurrences = 0;
    }
  }

  //API to fetch clicked History Info
  showHistory(history: History){
    this.historyModal = true;
    this.historyOriginalText = history.originalText;
    this.historyUpdatedText = history.updatedText;
    this.historyDate = history.timeStamp;
  }

  //API to reset all data
  clearForm(){
    this.textValue = null;
    this.updatedText = null;
    this.findWord = null;
    this.replaceWord = null;
  }
}