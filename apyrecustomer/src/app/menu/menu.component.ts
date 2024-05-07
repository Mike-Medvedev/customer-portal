import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent{
form: FormGroup = new FormGroup({});

constructor(private fb: FormBuilder){
  this.form = this.fb.group({
    fname: ['', Validators.required],
    lname: [''],
    phone: [''],
    email: [''],
    residence: this.fb.group({
      street: [''],
      apt: 0,
      city: [''],
      state: [''],
      zipcode: 0,
    }),
    decedent: this.fb.group({
      address: ['']
    })
  })

}


}
