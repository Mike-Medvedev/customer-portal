import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Decedent } from '../structure/decedent';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';



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
  selector: 'app-onboard-forms',
  templateUrl: './onboard-forms.component.html',
  styleUrls: ['./onboard-forms.component.scss'],
})
export class OnboardFormsComponent implements OnInit {
testData!: stepData
testData2!: stepData
testData3!: stepData
testData4!: stepData
items!: MenuItem[];
activeIndex: number = 0;
constructor(private apiSvc: ApiService, private router: Router){
  
}

nextPage(): void{
  this.activeIndex++;
}
prevPage(): void{
  this.activeIndex--;
}
reviewForm(): void {
this.activeIndex++
}
complete(): void {
  this.router.navigate(['landing']);
  }

ngOnInit(): void {

  this.items = [
    {
      label: 'Form-1',
    },
    {
      label: 'Form-2',
    },
    {
      label: 'Form-3',
    },
    {
      label: 'Form-4',
    },
    {
      label: 'Form-5',
    },
    {
      label: 'Form-6',
    },
    {
      label: 'Form-7',
    },

];

  
 //step1 form1
  this.testData = {
    header: 'CONTACT PERSON',
    hasIcon: true,
    copyIcon: true,
    fieldConfigs: {
      firstName: { fieldName: 'First Name', fieldType: 'text', value: '', columns: 6 },
      lastName: { fieldName: 'Last Name', fieldType: 'text', value: '', columns: 6  },
      Phone: { fieldName: 'Phone', fieldType: 'text', value: '', columns: 6 }, /*{gridLines: 4, breakpoint: lg}, tooltip: any? },*/
      Email: { fieldName: 'Email', fieldType: 'text', value: '', columns: 6},
    }
};

this.testData2 = {
  header: 'CONTACT PERSON RESIDENCE',
  hasIcon: false,
  copyIcon: true,
  fieldConfigs: {
    street: { fieldName: 'Street', fieldType: 'text', value: '', columns: 9 },
    apt: { fieldName: 'Apt. #', fieldType: 'text', value: '', columns: 3  },
    Phone: { fieldName: 'City', fieldType: 'text', value: '', columns: 8 }, /*{gridLines: 4, breakpoint: lg}, tooltip: any? },*/
    Email: { fieldName: 'State', fieldType: 'text', value: '', columns: 2},
    suffix: { fieldName: 'Zipcode', fieldType: 'text', value: '', columns: 2}
  }
};
this.testData3 = {
  header: 'SERVICE LOCATION / TYPE',
  hasIcon: true,
  copyIcon: false,
  fieldConfigs: {
    address: { fieldName: 'Address', fieldType: 'text', value: '', columns: 6 },
    serviceType: { fieldName: 'Service Type', fieldType: 'pill', value: '', columns: 3, options: ['At-Need', 'Pre-Need']  },
  }
};
this.testData4 = {
  header: 'Contact Residents',
  hasIcon: false,
  copyIcon: true,
  fieldConfigs: {
    firstName: { fieldName: 'First Name', fieldType: 'text', value: 'David', columns: 3  },
    lastName: { fieldName: 'Last Name', fieldType: 'text', value: 'Medvedev', columns: 6  },
    maidenName: { fieldName: 'Maiden Name', fieldType: 'checkbox', value: 'Berenstein', columns: 8 }, /*{gridLines: 4, breakpoint: lg}, tooltip: any? },*/
    middleName: { fieldName: 'Middle Name', fieldType: 'text', value: 'N/A', columns: 1  },
    suffix: { fieldName: 'Suffix', fieldType: 'select', value: 'Sr', columns: 2,  options: ['Jr', 'Sr', 'N/A'] }
  }
};
//step1 form2
  // this.testData2 = {
  //   header: 'Contact Person Residence',
  //   icon: false,
  //   copyIcon: true,
  //   fields: {
  //     decadent: {
  //       firstName: {'Michael', type: 'text'},
  //       lastName: 'Medvedev',
  //       maidenName: 'Berenstein',
  //     middleName: 'Zachary'
  //     }
  //   }
  // };

  // this.testData3 = {
  //   header: 'Location',
  //   icon: false,
  //   copyIcon: false,
  //   fields: {
  //     decadent: {
  //       firstName: 'Michael',
  //       lastName: 'Medvedev',
  //       maidenName: 'Berenstein',
  //     middleName: 'Zachary'
  //     }
  //   }
  // };
  




  // this.testData  = {
  //   Decedent: {
  //     firstName: 'Michael',
  //     lastName: 'Medvedev',
  //     maidenName: 'Berenstein',
  //     middleName: 'Zachary'
  //   }
  // };
  // this.testData2 = {
  //   street: '11 gary road',
  //   city: 'Stamford',
  //   state: 'CT',
  // }
}

handleFormData(formData: any){
  this.apiSvc.sendFormData(formData).subscribe(repsonse => console.log(repsonse))
}

//for each data in model map each property to a formcontrol

}