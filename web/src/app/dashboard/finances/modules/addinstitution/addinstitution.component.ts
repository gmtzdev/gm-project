import { Component } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ErrorModal } from '../../../../shared/classes/modals/ErrorModal';
import { lastValueFrom } from 'rxjs';
import { SuccessModal } from '../../../../shared/classes/modals/SuccessModal';

@Component({
  selector: 'app-addinstitution',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addinstitution.component.html',
  styleUrl: './addinstitution.component.scss',
})
export class AddinstitutionComponent {
  keyword: string = 'name';

  constructor(
    private financesService: FinancesService,
    private location: Location
  ) {}

  public addInstitution: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  async ngOnInit(): Promise<void> {
    const inputs = document.querySelectorAll('.input');
    function addFocus(this: any) {
      const parent = this.parentNode;
      parent.classList.add('focus');
    }
    function removeFocus(this: any) {
      const parent = this.parentNode;
      if (this.value == '') {
        parent.classList.remove('focus');
      }
    }
    inputs.forEach((input) => {
      input.addEventListener('focus', addFocus);
      input.addEventListener('blur', removeFocus);
    });
    function animateBtn(this: any) {
      this.classList.add('animate');
      setTimeout(() => {
        this.classList.remove('animate');
      }, 600);
    }
    const btns = document.querySelectorAll('.btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', animateBtn);
    });

    await this.initializer();
  }
  private async initializer() {
    // const resOrigins = await lastValueFrom(this.financesService.getOrigins());
    // if (resOrigins.length != 0) {
    //   this.origins = resOrigins;
    // }
  }
  onFocused(id: string) {
    id = `ng-autocomplete-${id}`;
    const label = document.getElementById(id) as HTMLDivElement;
    label.classList.add('focus');
  }
  onClosed(id: string) {
    const formControl = id;
    this.dynamicVerify(formControl);
    id = `ng-autocomplete-${id}`;
    const label = document.getElementById(id) as HTMLDivElement;
    if (
      this.addInstitution.controls[formControl].value == '' ||
      this.addInstitution.controls[formControl].value == null
    )
      label.classList.remove('focus');
  }
  public cancel() {
    setTimeout(() => {
      this.location.back();
    }, 500);
  }
  public async saveInstitution() {
    const btnSave = document.getElementById(
      'saveInstitution'
    ) as HTMLButtonElement;
    btnSave.disabled = true;
    if (!this.addInstitution.valid) {
      ErrorModal.Center.fire({ title: 'Invalid form' });
      this.showInvalids();
      btnSave.disabled = false;
      return;
    }
    const result = await lastValueFrom(
      this.financesService.saveInstitution(this.addInstitution.value)
    );
    if (!result.success) {
      alert('Show Error');
      return;
    }
    setTimeout(() => {
      SuccessModal.TopEnd.fire({ title: 'Institution saved successfully' });
      this.resetForm();
      btnSave.disabled = false;
    }, 500);
  }
  private resetForm() {
    this.addInstitution.reset();
    const inputs = document.querySelectorAll(
      '.input'
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      const parent = inputs[i].parentNode as HTMLDivElement;
      if (inputs[i].value == '') {
        parent.classList.remove('focus');
      }
    }
  }
  private showInvalids() {
    for (const input in this.addInstitution.controls) {
      const formControl = this.addInstitution.get(input);
      const htmlInput = document.getElementById(input) as HTMLElement;
      if (htmlInput) {
        if (!formControl?.valid) {
          htmlInput.style.boxShadow = '5px 5px 5px rgba(215, 34, 68, 0.88)';
        } else {
          htmlInput.style.boxShadow = 'none';
        }
      }
    }
  }
  public dynamicVerify(controlName: string): void {
    const htmlInput = document.getElementById(controlName) as HTMLElement;
    if (htmlInput) {
      if (!this.addInstitution.controls[controlName].valid) {
        htmlInput.style.boxShadow = '5px 5px 5px rgba(215, 34, 68, 0.88)';
      } else {
        htmlInput.style.boxShadow = 'none';
      }
    }
  }
}
