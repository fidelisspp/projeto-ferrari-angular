import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pilot } from '../../models/pilots';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  pilot: Pilot;
  isEdit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pilot
  ) {
    this.pilot = { ...data };
  }

  ngOnInit(): void {
    if (this.pilot.id !== undefined && this.pilot.id !== null) {
      this.isEdit = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
