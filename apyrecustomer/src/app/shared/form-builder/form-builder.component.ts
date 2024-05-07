import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


interface FieldConfig {
  fieldName: string;
  fieldType: string;
  value: any;
  columns: number;
  options?: string[];
}

interface stepData {
  header: string;
  hasIcon: boolean;
  copyIcon: boolean;
  fieldConfigs: { [key: string]: FieldConfig };
}

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  @Input() formData!: stepData;
  @Output() formDataSubmitted = new EventEmitter<any>();
  yourForm!: FormGroup;
  formArray: { key: string; config: FieldConfig }[] = [];
  stateOptions: any[] = [
    { label: 'Off', value: 'off' },
    { label: 'On', value: 'on' }
];
At_need: boolean = true;
Pre_need: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createFormArray();
  }

  private createFormArray(): void {
    this.formArray = Object.keys(this.formData.fieldConfigs).map((key: string) => ({
      key,
      config: this.formData.fieldConfigs[key],
    }));
    const formControls: { [key: string]: FormControl } = {};
    this.formArray.forEach((field) => {
      formControls[field.key] = new FormControl(field.config.value, Validators.required);
    });

    this.yourForm = this.fb.group(formControls);



  }

  getFormControl(key: string): FormControl {
    return this.yourForm.get(key) as FormControl;
  }

  onSubmit(){
    console.log(this.yourForm.value)
    this.formDataSubmitted.emit(this.yourForm.value)
  }

  toggle(button: string): void {
    if (button === 'atNeed') {
      if(this.Pre_need)
      this.At_need = !this.At_need;
      if (this.At_need) {
        this.Pre_need = false;
      }
    } else if (button === 'preNeed') {
      if(this.At_need)
      this.Pre_need = !this.Pre_need;
      if (this.Pre_need) {
        this.At_need = false;
      }
    }
  }
}