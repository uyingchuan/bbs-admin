import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * 触发表单校验
 * @param formControl
 */
export function isInvalidForm(formControl: FormGroup | FormArray | FormControl | AbstractControl): boolean {
  if (formControl instanceof FormControl) {
    formControl.markAsDirty();
    formControl.updateValueAndValidity({ onlySelf: true });
    return formControl.invalid;
  }

  if (formControl instanceof FormGroup || formControl instanceof FormArray) {
    Object.values(formControl.controls).forEach((control) => {
      isInvalidForm(control);
    });
  }

  formControl.markAsDirty();
  formControl.updateValueAndValidity({ onlySelf: true });
  return formControl.invalid;
}
