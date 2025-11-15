import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FinancesService } from '../../core/services/finances.service';
import { lastValueFrom } from 'rxjs';
import { Origin } from '../../core/models/database/Origin.model';
import { Location } from '@angular/common';
import { SuccessModal } from '../../../../shared/classes/modals/SuccessModal';
import { ErrorModal } from '../../../../shared/classes/modals/ErrorModal';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

@Component({
  selector: 'app-addincome',
  standalone: true,
  imports: [ReactiveFormsModule, AutocompleteLibModule],
  templateUrl: './addincome.component.html',
  styleUrl: './addincome.component.scss',
})
export class AddincomeComponent implements OnInit {
  public origins: Origin[] = [];
  keyword: string = 'name';

  constructor(
    private financesService: FinancesService,
    private location: Location
  ) {}

  public addIncome: FormGroup = new FormGroup({
    concept: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    origin: new FormControl('', Validators.required),
    created_at: new FormControl('', Validators.required),
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
    this.financesService.getOrigins().subscribe({
      next: (resOrigins: HttpResponse) => {
        if (!resOrigins.success) {
          return;
        }
        this.origins = resOrigins.data;
      },
    });
  }
  onFocused(id: string) {
    id = `ng-autocomplete-${id}`;
    const label = document.getElementById(id) as HTMLDivElement;
    label.classList.add('focus');
  }
  onClosed(id: string, valid: boolean = true) {
    const formControl = id;
    if (valid) this.dynamicVerify(formControl);
    const id_label = `ng-autocomplete-${id}`;
    const label = document.getElementById(id_label) as HTMLDivElement;
    if (
      this.addIncome.controls[id].value == '' ||
      this.addIncome.controls[id].value == null
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
    if (!this.addIncome.valid) {
      ErrorModal.Center.fire({ title: 'Invalid form' });
      this.showInvalids();
      btnSave.disabled = false;
      return;
    }
    const result = await lastValueFrom(
      this.financesService.saveIncome(this.addIncome.value)
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
    this.addIncome.reset();
    const inputs = document.querySelectorAll(
      '.input'
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      const parent = inputs[i].parentNode as HTMLDivElement;
      if (inputs[i].value == '') {
        parent.classList.remove('focus');
      }
    }
    this.onClosed('origin', false);
  }
  private showInvalids() {
    for (const input in this.addIncome.controls) {
      const formControl = this.addIncome.get(input);
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
      if (!this.addIncome.controls[controlName].valid) {
        htmlInput.style.boxShadow = '5px 5px 5px rgba(215, 34, 68, 0.88)';
      } else {
        htmlInput.style.boxShadow = 'none';
      }
    }
  }
}
