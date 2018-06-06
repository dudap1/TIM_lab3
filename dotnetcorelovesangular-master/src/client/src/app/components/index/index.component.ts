import { Component, OnInit } from '@angular/core';
import { ValuesService } from '../../services/values.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  result: any;
  showResponse: boolean = false;
  values: any;
  data: any = {
    value: ''
  };
  constructor(private valuesService: ValuesService, private auth: AuthService) { }

  ngOnInit() {
    this.valuesService.getValues()
      .subscribe(values => this.values = values);
  }

  submit() {
    this.valuesService.create(this.data)
      .subscribe(result => {
        this.result = result;
        console.log(result);
      });
  }

  delete() {
    this.valuesService.delete("data")
    .subscribe(result => {
      this.result = result;
      console.log(result);
    });
  }

  responseHover() {
    this.showResponse = !this.showResponse;
  }
}
