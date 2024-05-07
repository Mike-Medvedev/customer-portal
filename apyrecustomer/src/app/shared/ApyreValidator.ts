import {AbstractControl, ValidatorFn, Validators} from "@angular/forms";
import * as moment from 'moment-timezone';

export const abbv = ["AK",
    "AL",
    "AR",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VA",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY",
    "N/A"];

export const ApyreValidators = {
    maxLength: Validators.maxLength,
    minLength: Validators.minLength,
    max: Validators.max,
    min: Validators.min,
    numbersOnly,
    numberType,
    noNumbers,
    maxWords,
    lettersOnly,
    noSpecialCharacters,
    name,
    allWordsCaps,
    firstLetterCaps,
    allCaps,
    dateRange: dateRange(),
    birthAndDeathRange: dateRange('birthAndDeathRange'),
    warDateRange: dateRange('warDateRange'),
    pastDate,
    arrayNotEmpty,
    email,
    phone,
    ss,
    state,
    zipcode,
    password,
    equalTo,
    time,
    required: Validators.required,
    requiredTrue: Validators.requiredTrue,
    noExtraSpaces
};


function numbersOnly(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return /^\d*$/.test(ctrl.value) ? null : {numbersOnly: true};
}

function numberType(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return typeof ctrl?.value === 'number' ? null : {numberType: true}
}

function noNumbers(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return /^[^\d]*$/.test(ctrl.value) ? null : {noNumbers: true};
}

function maxWords(numOfWords: number): ValidatorFn {
    return (ctrl: AbstractControl) => {
        if (!ctrl.value) return null;
        const actualLength = ctrl.value.trim().replace(/[\s]{2,}/g, ' ').split(' ').length;
        return actualLength > numOfWords ? {maxWords: {max: numOfWords, actual: actualLength}} : null;
    }
}

function lettersOnly(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return /^\D*$/.test(ctrl.value) ? null : {lettersOnly: true};
}

function noExtraSpaces(ctrl: AbstractControl) {
    if ((typeof ctrl?.value === 'string' && ctrl?.value === '') || typeof ctrl?.value !== 'string') return null;
    if (/^[\s]|[\s]$/.test(ctrl.value)) return {noExtraSpaces: true}
    if (/[\s]{2,}/g.test(ctrl.value)) return {noExtraSpaces: true}
    return null;
}

function noSpecialCharacters(exceptions?: string[]): ValidatorFn {
    return (ctrl: AbstractControl) => {
        if (!ctrl.value) return null;
        let pattern = 'A-Za-z0-9\\s';
        if (exceptions && exceptions.length > 0) {
            for (let exception of exceptions) {
                pattern = pattern + `\\${exception}`;
            }
        }
        const regex = new RegExp(`^[${pattern}]*$`)
        return regex.test(ctrl.value) ? null : {noSpecialCharacters: exceptions ?? []};
    }
}

function name(ctrl: AbstractControl) {
    const val = ctrl.value;
    if (!val) return null;
    if (typeof val !== 'string' || (val.length > 1 && val === val.toUpperCase())) return {name: true}
    //First Letter should be caps, at most two caps per word. Each word should be capitalized. Split words by hyphan or space
    const words = val.trim().replace(/[\s]{2,}/g, ' ').split(/(\s|\-|\')/);
    let failed = false;
    for (let word of words) {
        let count = 0;
        if (!word) continue;
        if (word[0] && word[0] !== word[0].toUpperCase()) {
            failed = true;
            break;
        }
        for (let char of word.split('')) {
            if (char === char.toUpperCase()) count = count + 1;
        }
        if (count > 2) {
            failed = true;
            break;
        }
    }
    return failed ? {name: true} : null;
}

function allWordsCaps(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    const words = ctrl.value.trim().split(/(\s|\-)/);
    let failed = false;
    for (let word of words) {
        if (!word || !word[0]) continue;
        if (word[0] !== word[0].toUpperCase()) {
            failed = true;
            break;
        }
    }
    return failed ? {allWordsCaps: true} : null;
}

function firstLetterCaps(ctrl: AbstractControl) {
    if (!ctrl.value || typeof ctrl.value !== 'string' || ctrl.value.length < 1) return null;
    return ctrl.value[0] !== ctrl.value[0].toUpperCase() ? {firstLetterCaps: true} : null;
}

function allCaps(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return ctrl.value !== ctrl.value.toUpperCase() ? {allCaps: true} : null;
}


function dateRange(errorType: string = 'dateRange') {
    return function (limits: {start?: string, end?: string}): ValidatorFn {
        return (ctrl: AbstractControl): {[key: string]: any} | null => {
            if (!ctrl.value) return null;
            const pastdate = pastDate(ctrl);
            if (pastdate) return pastdate;
            if (!/\d{8}/.test(ctrl.value)) return {'improper-date': true};
            if (!moment(ctrl.value, 'MMDDYYYY').isValid()) return {'improper-date': true};
            const date = moment(ctrl.value, 'MMDDYYYY');

            if (!limits.start || !/\d{8}/.test(limits.start)) limits.start = '01011900';
            const startDate = moment(limits.start, 'MMDDYYYY');
            if (!limits.end || !/\d{8}/.test(limits.end) || moment(limits.end, 'MMDDYYYY').valueOf() > moment().valueOf()) limits.end = moment().format('MMDDYYYY');
            const endDate = moment(limits.end, 'MMDDYYYY');
            if (date.valueOf() > endDate.valueOf() || date.valueOf() < startDate.valueOf()) return {[errorType]: {start: formatBareStringDate(limits.start), end: formatBareStringDate(limits.end), actual: formatBareStringDate(ctrl.value)}}

            return null;
        }
    }
}

function pastDate(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    if (!/\d{8}/.test(ctrl.value)) return {'improper-date': true};
    if (!moment(ctrl.value, 'MMDDYYYY').isValid()) return {'improper-date': true};
    if (moment(ctrl.value, 'MMDDYYYY').valueOf() > moment().valueOf()) return {'past-date': true};
    return null;
}

function arrayNotEmpty(ctrl: AbstractControl) {
    let array = ctrl.value;
    if (Array.isArray(array) && array.length > 0) {
        return null;
    }
    return {emptyFormArray: true};
}

function email(ctrl: AbstractControl) {
    let email = ctrl.value;
    if (!email) return null;
    if (typeof email !== 'string') {
        return {email: true};
    }
    return !isEmail(email) ? {email: true} : null;
}


function phone(ctrl: AbstractControl) {
    let phone = ctrl.value;
    if (phone && !phone.match(/^[0-9]{10}$/)) {
        return {
            phone: true
        }
    }
    return null;
}
function ss(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    return /^[\d]{9,9}$/.test(ctrl.value) ? null : {ss: true};
}
function state(ctrl: AbstractControl) {
    let state = ctrl.value as string;
    if (!state) {
        return null;
    }
    if (abbv.indexOf(state) < 0) {
        return {
            state: true
        }
    }
    return null;
}
function zipcode(ctrl: AbstractControl) {
    let value = ctrl.value as string;
    if (!value) {
        return null;
    }
    if (!value.match(/^[0-9]{5}(-[0-9]{4})?$/)) {
        return {
            zipcode: true
        }
    }
    return null;
}

function time(ctrl: AbstractControl) {
    let value = ctrl.value;
    if (!value) {
        return null;
    }
    if (typeof value !== 'string' || value.length < 4) {
        return {time: true}
    }
    const stringArray = value.split('');
    const hours = parseInt(stringArray.slice(0, 2).join(''));
    const minutes = parseInt(stringArray.slice(2).join(''));
    if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return {time: true}
    return null;
}

function password(ctrl: AbstractControl) {
    let pw = ctrl.value;
    if (!pw) {
        return {password: 'must be at least 8 characters long; containing at least one symbol and one number.'};
    }
    if (pw.length < 8) {
        return {
            password: 'must be at least 8 characters long.'
        };
    }
    if (pw.match(/\s+/g)) {
        return {password: 'must contain at least one symbol.'};
    }
    if (!pw.match(/[^A-Za-z0-9]+/g)) {
        return {password: 'must contain at least one symbol.'};
    }

    if (!pw.match(/[\d]+/g)) {
        return {password: 'must contain at least one number.'};
    }

    if (!pw.match(/[A-Z]+/g)) {
        return {password: 'must contain at least one capital letter.'};
    }
    if (!pw.match(/[a-z]+/g)) {
        return {password: 'must contain at least one lowercase letter.'};
    }

    return null;
}

function equalTo(value: any): ValidatorFn {
    return (ctrl: AbstractControl) => {
        if (!ctrl.value) return null;
        if (ctrl?.value !== value) return {equalTo: {test: value, actual: ctrl.value}}
        return null;
    }
}


export const isEmail = (email: string): boolean => !!email.match(/^[a-zA-Z0-9\+\-\_\~\.]*@[[a-zA-Z0-9\-\.]{1,}\.[a-zA-Z0-9]{2,}$/);

function formatBareStringDate(date: string) {
    return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`
}
