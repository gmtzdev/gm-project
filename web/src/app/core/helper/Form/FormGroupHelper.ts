import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class FormGroupHelper {
  static toFormGroup<T>(formBuilder: FormBuilder, model: T): FormGroup {
    const formGroup = formBuilder.group({});
    Object.keys(model as object).forEach((key) => {
      formGroup.addControl(
        key,
        formBuilder.control((model as any)[key], Validators.required)
      );
    });
    return formGroup;
  }
}
