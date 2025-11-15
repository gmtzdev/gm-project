import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { BankCardComponent } from '../../../../components/utils/bank-card/bank-card.component';
import { FinancesService } from '../../core/services/finances.service';
import { Category } from '../../core/models/database/Category.model';
import { Payment } from '../../core/models/database/Payment.model';
import { Institution } from '../../core/models/database/Institution.model';
import { Card } from '../../core/models/database/Card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { ErrorModal } from '../../../../shared/classes/modals/ErrorModal';
import { SuccessModal } from '../../../../shared/classes/modals/SuccessModal';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

@Component({
  selector: 'app-editbill',
  standalone: true,
  imports: [ReactiveFormsModule, AutocompleteLibModule, BankCardComponent],
  providers: [DatePipe],
  templateUrl: './editbill.component.html',
  styleUrl: './editbill.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditbillComponent {
  private formBuilder: FormBuilder = new FormBuilder();
  private formClon?: FormGroup;

  public categories: Category[] = [];
  public payments: Payment[] = [];
  public institutions: Institution[] = [];
  public cards: Card[] = [];
  keyword: string = 'name';

  public editBill: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    concept: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    payment: new FormControl('', Validators.required),
    card: new FormControl('', Validators.required),
    institution: new FormControl('', Validators.required),
    created_at: new FormControl('', Validators.required),
    updated_at: new FormControl('', Validators.required),
    visible: new FormControl('', Validators.required),
  });

  constructor(
    private readonly financesService: FinancesService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  async ngOnInit(): Promise<void> {
    this.prepareAnimations();
    await this.initializer();
    this.setInfoOfBill();
  }

  private prepareAnimations() {
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
  }
  private async initializer() {
    this.financesService.getCartegories().subscribe({
      next: (resCategories: HttpResponse) => {
        if (!resCategories.success) {
          // Error
          return;
        }
        this.categories = resCategories.data as Category[];
      },
    });

    this.financesService.getPayments().subscribe({
      next: (resPayment: HttpResponse) => {
        if (!resPayment.success) {
          // Error
          return;
        }
        this.payments = resPayment.data as Payment[];
      },
    });

    this.financesService.getInstitutions().subscribe({
      next: (resInstitution: HttpResponse) => {
        if (!resInstitution.success) {
          // Error
          return;
        }
        this.institutions = resInstitution.data as Institution[];
      },
    });

    this.financesService.getCards().subscribe({
      next: (resCard: HttpResponse) => {
        if (!resCard.success) {
          // Error
          return;
        }
        this.cards = resCard.data as Card[];
      },
    });
  }
  private setCard(card: Card) {
    const swiper = document.querySelector('swiper-container');
    if (card.id == 1) swiper?.swiper.slideTo(2);
    if (card.id == 2) swiper?.swiper.slideTo(1);
    if (card.id == 3) swiper?.swiper.slideTo(0);
  }

  private async setInfoOfBill() {
    const params: any = await firstValueFrom(this.activatedRoute.params);
    this.financesService
      .getBill(params.id)
      .pipe(
        map((res: HttpResponse) => {
          res.data.created_at = this.datePipe.transform(
            res.data.created_at,
            'yyyy-MM-ddTHH:mm'
          );
          return res;
        })
        // tap(res => console.log(res))
      )
      .subscribe((response: HttpResponse) => {
        this.editBill.setValue(response.data);
        this.setCard(this.editBill.controls['card'].value);
        this.createClone(this.editBill);
      });

    const inputs = document.querySelectorAll('.input');
    inputs.forEach((input) => {
      const parent = input.parentNode as HTMLDivElement;
      parent.classList.add('focus');
    });
  }
  private createClone(formGroup: FormGroup): FormGroup {
    const clonedFormGroup = this.formBuilder.group({});

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        if (control instanceof FormGroup) {
          clonedFormGroup.addControl(key, this.createClone(control));
        } else {
          clonedFormGroup.addControl(
            key,
            new FormControl(
              control.value,
              control.validator,
              control.asyncValidator
            )
          );
        }
      } else {
        console.log('Error al clonar el formulario');
      }
    });

    this.formClon = clonedFormGroup;

    return this.formClon;
  }

  selectEventPayment($event: any) {
    const swiper = document.querySelector('swiper-container');
    if ($event.id == 1) swiper?.swiper.slideTo(2);
    if ($event.id == 2) swiper?.swiper.slideTo(1);
    if ($event.id == 3) swiper?.swiper.slideTo(0);
  }
  selectEvent($event: any) {
    console.log($event);
  }

  onChangeSearch($event: any) {
    console.log($event);
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
      this.editBill.controls[id].value == '' ||
      this.editBill.controls[id].value == null
    )
      label.classList.remove('focus');
  }

  public cancel() {
    setTimeout(() => {
      this.location.back();
    }, 500);
  }
  public async updateBill() {
    const btnSave = document.getElementById('saveBill') as HTMLButtonElement;
    btnSave.disabled = true;

    const cards = document.querySelectorAll('swiper-slide');
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].classList.contains('swiper-slide-active')) {
        this.editBill.controls['card'].setValue(this.cards[i]);
      }
    }
    if (!this.editBill.valid) {
      ErrorModal.Center.fire({ title: 'Invalid form' });
      this.showInvalids();
      btnSave.disabled = false;
      return;
    }
    const result = await lastValueFrom(
      this.financesService.updateBill(this.editBill.value)
    );
    if (!result.success) {
      alert('Error');
      return;
    }
    setTimeout(() => {
      SuccessModal.TopEnd.fire({ title: 'Bill updated successfully' });
      // this.resetForm();
      btnSave.disabled = false;
      this.location.back();
    }, 500);
  }
  private resetForm() {
    this.editBill.reset();
    const inputs = document.querySelectorAll(
      '.input'
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      const parent = inputs[i].parentNode as HTMLDivElement;
      if (inputs[i].value == '') {
        parent.classList.remove('focus');
      }
    }
    this.onClosed('category', false);
    this.onClosed('payment', false);
    this.onClosed('institution', false);
  }
  private showInvalids() {
    for (const input in this.editBill.controls) {
      const formControl = this.editBill.get(input);
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
      if (!this.editBill.controls[controlName].valid) {
        htmlInput.style.boxShadow = '5px 5px 5px rgba(215, 34, 68, 0.88)';
      } else {
        htmlInput.style.boxShadow = 'none';
      }
    }
  }

  public addCategory() {
    this.router.navigate(['finances', 'addCategory']);
  }
  public addCard() {
    this.router.navigate(['finances', 'addCard']);
  }
  public addInstitution() {
    this.router.navigate(['../../', 'addInstitution'], { relativeTo: this.activatedRoute });
  }
}
