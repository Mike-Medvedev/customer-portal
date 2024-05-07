import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Decedent } from '../structure/decedent';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApyreValidators } from '../shared/ApyreValidator';
import { TokenService } from '../services/token.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { map, Observable, of, Subject, tap } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductDialogComponent } from '../shared/product-dialog/product-dialog.component';
import { CartService } from '../services/cart.service';
import { Product } from '../structure/product';

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
  selector: 'app-prelim-form',
  templateUrl: './prelim-form.component.html',
  styleUrl: './prelim-form.component.scss',
  providers: [ConfirmationService, MessageService, DialogService],
})
export class PrelimFormComponent {
  items!: MenuItem[];
  activeIndex: number = 0;
  form!: FormGroup;
  isChecked!: boolean;
  stateOptions: any[] = [
    { label: 'At-need', value: 'atneed' },
    { label: 'Pre-need', value: 'preneed' },
  ];
  checkBoxOptions: any[] = [
    { name: 'Yes', key: 'y' },
    { name: 'No', key: 'n' },
    { name: 'Unknown', key: 'u' },
  ];
  copyMenu!: MenuItem[];
  copyMenu2!: MenuItem[];
  selectOptions: any;
  tokenExpiration!: any;
  stepChangeSubject = new Subject<number>();
  stepChange$ = this.stepChangeSubject.asObservable();

  ref: DynamicDialogRef | undefined;

  constructor(
    private apiSvc: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private tokenSvc: TokenService,
    private authSvc: AuthService,
    private clipBoard: Clipboard,
    private confirmationService: ConfirmationService,
    private dialogSvc: DialogService,
    public cartSvc: CartService,
  ) {}

  ngOnInit(): void {
    this.copyMenu = [
      {
        label: 'Copy From',
        items: [
          {
            label: 'Billing Info',
            command: () => {
              this.confirmCopy('billing');
            },
          },
          {
            label: 'Next of Kin',
            command: () => {
              this.confirmCopy('nextOfKin');
            },
          },
          {
            label: 'Decedent Address',
            command: () => {
              this.confirmCopy('decedentResidence');
            },
          },
        ],
      },
    ];
    this.copyMenu2 = [
      {
        label: 'Copy From',
        items: [
          {
            label: 'Decedent Resident',
            command: () => {
              this.copyFormData('decedentResidence');
            },
          },
          {
            label: 'Demographics',
            command: () => {
              this.copyFormData('demographics');
            },
          },
          {
            label: 'Surviving Spouse/Partner',
            command: () => {
              this.copyFormData('survivingSpouse');
            },
          },
        ],
      },
    ];
    this.items = [
      {
        label: 'Contact Info',
        styleClass: '',
      },
      {
        label: 'Decedent Info',
        styleClass: '',
      },
      {
        label: 'Parental Info',
        styleClass: '',
      },
      {
        label: 'Occupation',
        styleClass: '',
      },
      {
        label: 'Recipient',
        styleClass: '',
      },
      {
        label: 'Next of Kin',
        styleClass: '',
      },
      {
        label: 'Review',
        styleClass: '',
      },
    ];

    this.selectOptions = {
      suffix: [{ name: 'Jr' }, { name: 'Sr' }],
      sex: [{ name: 'Male' }, { name: 'Female' }, { name: 'Other' }],
      domestic: [
        { name: 'Single' },
        { name: 'Married' },
        { name: 'Seperated' },
        { name: 'Widow' },
        { name: 'Divorced' },
      ],
      cityLimit: [{ name: 'Yes' }, { name: 'No' }, { name: 'Unknown' }],
      race: [
        { name: 'Unknown' },
        { name: 'Unobtainable' },
        { name: 'Refused' },
        { name: 'White' },
        { name: 'Black' },
        { name: 'Native American' },
        { name: 'Asian Indian' },
        { name: 'Chinese' },
        { name: 'Filipino' },
        { name: 'Japanse' },
        { name: 'Korean' },
        { name: 'Vietnamese' },
        { name: 'Hawaiian' },
        { name: 'Guamanian' },
        { name: 'Samoan' },
        { name: 'Other' },
      ],
      origin: [
        { name: 'Non Hispanic' },
        { name: 'Unknown' },
        { name: 'Unobtainable' },
        { name: 'Refused' },
        { name: 'Mexican' },
        { name: 'Puerto Rican' },
        { name: 'Cuban' },
        { name: 'Other' },
      ],
      education: [
        { name: 'Unknown' },
        { name: 'Grade 8' },
        { name: 'Grade 12' },
        { name: 'Graduate' },
        { name: 'College Credit' },
        { name: 'Associate' },
        { name: 'Bachelors' },
        { name: 'Masters' },
        { name: 'Doctorate' },
      ],
    };
    this.tokenExpiration = this.tokenSvc.getTokenExp();
    //  this.form = this.fb.group({
    //   contactPerson: this.fb.group({
    //     firstName: ['', ApyreValidators.email],
    //     lastName: '',
    //     phone: '',
    //     email: '',
    //   }),
    //   contactResidence: this.fb.group({
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: ''
    //   }),
    //   service: this.fb.group({
    //     address: '',
    //     type: 'atneed'
    //   }),
    //   decedent: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     maidenName: '',
    //     lastName: '',
    //     suffix: '',
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: '',
    //     county: '',
    //     country: '',
    //     cityLimits: '',
    //     ss: '',
    //     sex: '',
    //     domesticStatus: '',
    //     countyOfDeath: '',
    //     municipalityOfDeath: '',
    //     stateOfDeath: '',
    //     dateOfDeath: '',
    //     armedForces: '',
    //     diedOnActiveDuty: '',
    //     nameOfWar: '',
    //     warServiceFrom: '',
    //     warServiceTo: '',
    //     race: '',
    //     otherRace: '',
    //     origin: '',
    //     otherOrigin: '',
    //     education: ''
    //   }),
    //   spouse: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     maidenName: '',
    //     suffix: ''
    //   }),
    //   mother: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     maidenName: '',
    //     suffix: ''
    //   }),
    //   father: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     suffix: ''
    //   }),
    //   caller: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     suffix: '',
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: '',
    //     phone: '',
    //     email: ''
    //   }),
    //   employer: this.fb.group({
    //     occupation: '',
    //     industry: '',
    //     name: '',
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: ''
    //   }),
    //   medical: this.fb.group({
    //     pronounced: '',
    //     medicalExaminerContacted: '',
    //     organDonor: '',
    //     contagiousDisease: '',
    //     radioactiveTherapy: '',
    //     typeOfRadiation: '',
    //     pacemaker: '',
    //     medicalRecordNumber: '',
    //     medicalExaminerNumber: '',
    //     doctorName: '',
    //     doctorPhone: '',
    //     placeOfDeath: '',
    //     otherPlaceOfDeath: '',
    //     facilityName: '',
    //     facilityAddress: ''
    //   }),
    //   nextOfKin: this.fb.group({
    //     relationship: '',
    //     otherRelationship: '',
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     suffix: '',
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: '',
    //     phone: '',
    //     email: ''
    //   }),
    //   additionalNextOfKin: this.fb.array([]), // Assuming this is an array of groups with no predefined structure
    //   billing: this.fb.group({
    //     firstName: '',
    //     middleName: '',
    //     lastName: '',
    //     suffix: '',
    //     street: '',
    //     street2: '',
    //     city: '',
    //     state: '',
    //     zipcode: '',
    //     phone: '',
    //     email: ''
    //   }),
    //   deliveryType: this.fb.group({
    //     pickup: 'pickup',
    //     ship: 'ship'
    //   }),
    //   recipients: this.fb.array([
    //     this.fb.group({
    //       remains: false,
    //       firstName: '',
    //       middleName: '',
    //       lastName: '',
    //       suffix: '',
    //       street: '',
    //       street2: '',
    //       city: '',
    //       state: '',
    //       zipcode: '',
    //       phone: '',
    //       email: ''
    //     })
    //   ])
    // });

    this.form = this.fb.group({
      contactPerson: this.fb.group({
        firstName: ['', ApyreValidators.email],
        lastName: '',
        phone: '',
        email: '',
      }),
      contactResidence: this.fb.group({
        street: '',
        apt: '',
        street2: '',
        city: '',
        state: '',
        zipcode: '',
      }),
      service: this.fb.group({
        address: '',
        apt: '',
        residence: '',
        type: 'atneed',
      }),
      decedent: this.fb.group({
        firstName: '',
        middleName: '',
        maidenName: '',
        lastName: '',
        suffix: '',
        sex: '',
        ss: '',
        domesticStatus: '',
      }),
      decedentResidence: this.fb.group({
        country: '',
        county: '',
        street: '',
        state: '',
        zipcode: '',
        cityLimits: '',
      }),
      demographics: this.fb.group({
        race: '',
        origin: '',
      }),
      survivingSpouse: this.fb.group({
        firstName: '',
        middleName: '',
        maidenName: '',
        lastName: '',
        suffix: '',
      }),
      decedentDeath: this.fb.group({
        countyOfDeath: '',
        municipalityOfDeath: '',
        stateOfDeath: '',
        dateOfDeath: '',
      }),
      decedentBirth: this.fb.group({
        countryOfBirth: '',
        cityOfBirth: '',
        stateOfBirth: '',
        dateOfBirth: '',
      }),
      decedentFather: this.fb.group({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
      }),
      decedentMother: this.fb.group({
        firstName: '',
        middleName: '',
        maidenName: '',
        lastName: '',
        suffix: '',
      }),
      education: this.fb.group({
        education: '',
      }),
      occupation: this.fb.group({
        occupation: '',
        industry: '',
        name: '',
      }),
      workAddress: this.fb.group({
        street: '',
        apt: '',
        street2: '',
        city: '',
        state: '',
        zipcode: '',
      }),
      armedForces: this.fb.group({
        armedForces: '',
        diedOnActiveDuty: '',
        nameOfWar: '',
        warServiceFrom: '',
        warServiceTo: '',
        deathCertificate: '',
      }),
      billing: this.fb.group({
        firstName: '',
        lastName: '',
        street: '',
        apt: '',
        street2: '',
        city: '',
        state: '',
        zipcode: '',
      }),
      deliveryType: this.fb.group({
        type: '',
      }),
      recipients: this.fb.array([
        this.fb.group({
          firstName: '',
          middleName: '',
          lastName: '',
          suffix: '',
          street: '',
          apt: '',
          street2: '',
          city: '',
          state: '',
          zipcode: '',
          phone: '',
          email: '',
        }),
      ]),
      nextOfKin: this.fb.group({
        relationship: '',
        otherRelationship: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        street: '',
        apt: '',
        street2: '',
        city: '',
        state: '',
        zipcode: '',
        phone: '',
        email: '',
      }),
      additionalNextOfKin: this.fb.array([
        this.fb.group({
          firstName: '',
          middleName: '',
          lastName: '',
          suffix: '',
          street: '',
          apt: '',
          street2: '',
          city: '',
          state: '',
          zipcode: '',
          phone: '',
          email: '',
        }),
      ]),
    });

    this.items = [
      {
        label: 'Contact Info',
        styleClass: '',
      },
      {
        label: 'Decedent Info',
        styleClass: '',
      },
      {
        label: 'Parental Info',
        styleClass: '',
      },
      {
        label: 'Occupation',
        styleClass: '',
      },
      {
        label: 'Recipient',
        styleClass: '',
      },
      {
        label: 'Next of Kin',
        styleClass: '',
      },
      {
        label: 'Review',
        styleClass: '',
      },
    ];

    this.stepChange$
      .pipe(
        tap(index => {
          this.items.forEach((item, i) => {
            if (item.styleClass !== 'border') item.styleClass = i <= index ? 'border' : '';
          });
        }),
      )
      .subscribe();
  }

  showProducts() {
    this.ref = this.dialogSvc.open(ProductDialogComponent, { width: '70%', showHeader: false });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) this.cartSvc.addProduct(product);
    });
  }

  confirmCopy(groupToCopyFrom: string) {
    this.confirmationService.confirm({
      message:
        "You are about to partially replace the contact person's info with the decedent address. Existing data will be lost. Do you wish to continue?",
      icon: 'pi pi-times-circle',
      header: 'Quick Copy',
      accept: () => {
        this.copyFrom(groupToCopyFrom);
      },
    });
  }
  getAddress(group: string): string {
    const formControls = this.form.get(group)?.value;
    const values = Object.values(formControls);

    let fullAddress = '';

    values.forEach(value => {
      value !== '' ? (fullAddress += `${value} `) : '';
    });

    return fullAddress;
  }

  addFormArray(array: string) {
    const formArray = this.form.get(array) as FormArray;
    const newRecipientGroup = this.fb.group({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      street: '',
      apt: '',
      street2: '',
      city: '',
      state: '',
      zipcode: '',
      phone: '',
      email: '',
    });
    formArray.push(newRecipientGroup);
    console.log(formArray.controls);
  }

  nextPage(): void {
    this.activeIndex++;
    this.stepChangeSubject.next(this.activeIndex);
  }
  prevPage(): void {
    this.activeIndex--;
    this.stepChangeSubject.next(this.activeIndex);
  }
  reviewForm(): void {
    this.activeIndex++;
    this.stepChangeSubject.next(this.activeIndex);
  }
  submitForm(): any {
    this.getFormValue();

    this.apiSvc.sendFormData(this.form.value).subscribe();
  }

  getFormControlValue(group: string, control: string) {
    const formGroup = this.form.get(group);
    return typeof formGroup?.get(control)?.value === 'object'
      ? formGroup?.get(control)?.value.name
      : formGroup?.get(control)?.value;
  }
  getFormArrayGroup(array: string) {
    const formArray = this.form.get(array) as FormArray;
  }
  getFormValue() {
    const formvalue = this.form.value;
    console.log(formvalue);
  }

  copyFrom(formGroupName: string) {
    const pasteGroup = this.form.get('contactPerson');
    const pasteGroup2 = this.form.get('contactResidence');

    const groupToCopy = this.form.get(formGroupName)?.value;

    Object.entries(groupToCopy).forEach(entry => {
      typeof pasteGroup?.get(entry[0]) !== 'undefined' || 'null'
        ? pasteGroup?.get(entry[0])?.patchValue(entry[1])
        : '';
      typeof pasteGroup2?.get(entry[0]) !== 'undefined' || 'null'
        ? pasteGroup2?.get(entry[0])?.patchValue(entry[1])
        : '';
    });

    console.log(Object.entries(groupToCopy));
  }

  copyFormData(formGroupName: string) {
    const currentFormGroup = this.form.get(formGroupName) as FormGroup;
    let formDataString = '';

    if (currentFormGroup) {
      Object.keys(currentFormGroup.controls).forEach(key => {
        const control = currentFormGroup.get(key);

        formDataString += `${control?.value} `;
      });

      this.clipBoard.copy(formDataString);

      console.log('Form data copied to clipboard:', formDataString);
    }
  }

  copyDynamicFormData(arrayName: string, index: number) {
    const formArray = this.form.get(arrayName) as FormArray;
    let formDataString = '';

    Object.values(formArray.controls[index].value).forEach(value => {
      if (value !== '') formDataString += `${value} `;
    });

    this.clipBoard.copy(formDataString);
  }

  deleteFormGroup(arrayName: string, index: number) {
    const formArray = this.form.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }

  get recipientsArray() {
    return this.form.get('recipients') as FormArray;
  }

  get nextOfKinArray() {
    return this.form.get('additionalNextOfKin') as FormArray;
  }

  get armedFormControl() {
    const controls = this.form.get('armedForces')?.value;

    console.log(controls);

    return Object.entries(controls);
  }
}
