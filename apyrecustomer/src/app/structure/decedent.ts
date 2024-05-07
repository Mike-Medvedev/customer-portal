export interface Decedent {
        firstName?: {value: string, type: string};
        middleName?: {value: string, type: string};
        maidenName?: {value: string, type: string};
        lastName?: {value: string, type: string};
        suffix?: {value: string, type: string,};
        street?: {value: string, type: string};
        street2?: {value: string, type: string};
        city?: {value: string, type: string};
        state?: {value: string, type: string};
        zipcode?: string;
        county?: string;
        country?: string;
        cityLimits?: 'yes' | 'no' | 'unknown';
        ss?: string;
        sex?: 'male' | 'female' | 'other';
        domesticStatus?: 'single';
        countyOfDeath?: string;
        municipalityOfDeath?: string;
        stateOfDeath?: string;
        dateOfDeath?: string;
        countryOfBirth?: string;
        cityOfBirth?: string;
        stateOfBirth?: string;
        dateOfBirth?: string;
        armedForces?: 'yes' | 'no' | 'unknown';
        diedOnActiveDuty?: 'yes' | 'no' | 'unknown';
        nameOfWar?: string;
        warServiceFrom?: string;
        warServiceTo?: string;
        race?: 'unknown' | 'unobtainable' | 'refused' | 'white' | 'black' | 'native_american' | 'asian_indian' | 'chinese' | 'filipino' | 'japanese' | 'korean' | 'vietnamese' | 'hawaiian' | 'guamanian' | 'samoan' | 'other';
        otherRace?: string;
        origin?: 'non_hispanic' | 'unknown' | 'unobtainable' | 'refused' | 'mexican' | 'puerto_rican' | 'cuban' | 'other';
        otherOrigin?: string;
        education?: 'uknown' | 'grade8' | 'grade12' | 'grad' | 'college_credit' | 'associate' | 'associate' | 'bachelor' | 'master' | 'doctorate';
}
