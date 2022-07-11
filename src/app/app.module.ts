import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { StickyHeaderDirective } from './sticky-header.directive';
import { importType } from '@angular/compiler/src/output/output_ast';

@NgModule({
  declarations: [
    AppComponent,
    StickyHeaderDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DataTableModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
