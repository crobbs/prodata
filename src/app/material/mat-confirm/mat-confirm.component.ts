import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-mat-confirm',
  templateUrl: './mat-confirm.component.html',
  styleUrls: ['./mat-confirm.component.scss']
})
export class MatConfirmComponent implements OnInit {

  title = '';
  message = '';
  
  constructor(private dialogRef: MatDialogRef<MatConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) data: { title: string, message: string }) {
    this.title = data ? data.title : '';
    this.message = data ? data.message : '';
  }

  ngOnInit(): void {
  }

}
