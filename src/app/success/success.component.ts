import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { SucessService } from './sucess.service'

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  errMsg : string = '';
  defIcon = 'info'
  constructor(public dialog: MatDialog, private dialogRef : MatDialogRef<SuccessComponent>, private service : SucessService) {}

  ngOnInit(): void {
    this.service.currMsg.subscribe(res => this.errMsg = res)
    this.service.currIcon.subscribe(res => this.defIcon = res)
  }

  onClick(){
    this.dialogRef.close();
  }
  

}
