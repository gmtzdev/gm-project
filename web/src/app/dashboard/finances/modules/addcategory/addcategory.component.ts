import { Component } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { ErrorModal } from '../../../../shared/classes/modals/ErrorModal';
import { SuccessModal } from '../../../../shared/classes/modals/SuccessModal';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@Component({
  selector: 'app-addcategory',
  standalone: true,
  imports: [ReactiveFormsModule, AutocompleteLibModule],
  templateUrl: './addcategory.component.html',
  styleUrl: './addcategory.component.scss',
})
export class AddcategoryComponent {
  keyword: string = 'name';

  constructor(
    private financesService: FinancesService,
    private location: Location
  ) {}

  public addCategory: FormGroup = new FormGroup({
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
    this.dynamicVerify(id);
    id = `ng-autocomplete-${id}`;
    const label = document.getElementById(id) as HTMLDivElement;
    if (
      this.addCategory.value.origin == '' ||
      this.addCategory.value.origin == null
    )
      label.classList.remove('focus');
  }
  public cancel() {
    setTimeout(() => {
      this.location.back();
    }, 500);
  }
  public async saveIncome() {
    const btnSave = document.getElementById('saveIncome') as HTMLButtonElement;
    btnSave.disabled = true;
    if (!this.addCategory.valid) {
      ErrorModal.Center.fire({ title: 'Invalid form' });
      this.showInvalids();
      btnSave.disabled = false;
      return;
    }
    const result = await lastValueFrom(
      this.financesService.saveIncome(this.addCategory.value)
    );
    if (!result.success) {
      alert('Show Error');
      return;
    }
    setTimeout(() => {
      SuccessModal.TopEnd.fire({ title: 'Income saved successfully' });
      this.resetForm();
      btnSave.disabled = false;
    }, 500);
  }
  private resetForm() {
    this.addCategory.reset();
    const inputs = document.querySelectorAll(
      '.input'
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      const parent = inputs[i].parentNode as HTMLDivElement;
      if (inputs[i].value == '') {
        parent.classList.remove('focus');
      }
    }
    this.onClosed('origin');
  }
  private showInvalids() {
    for (const input in this.addCategory.controls) {
      const formControl = this.addCategory.get(input);
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
      if (!this.addCategory.controls[controlName].valid) {
        htmlInput.style.boxShadow = '5px 5px 5px rgba(215, 34, 68, 0.88)';
      } else {
        htmlInput.style.boxShadow = 'none';
      }
    }
  }
}
