import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  errMsg : string = '';
  defIcon = 'info'
  constructor(public dialog: MatDialog, private dialogRef : MatDialogRef<AlertComponent>, private service : AlertService) {}

  ngOnInit(): void {
    this.service.currMsg.subscribe(res => this.errMsg = res)
    this.service.currIcon.subscribe(res => this.defIcon = res)
  }

  onClick(){
    this.dialogRef.close();
  }
  

}
