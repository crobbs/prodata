import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
    <p>{{ data.content }}</p>
    
    <p>{{ data.subcontent }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Ok, fechar</button>
    </div>
  `,
})
export class DynamicDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}