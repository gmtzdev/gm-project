import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddContributionModalService } from '../../../../shared/services/modals/add-contribution-modal.service';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DatesService } from '../../../../shared/services/global/dates.service';
import { ErrorModal } from '../../../../shared/classes/modals/ErrorModal';
import { FinancesService } from '../../core/services/finances.service';
import { HttpResponse } from '../../../../shared/models/http/HttpResponse.model';

@Component({
  selector: 'app-addcontribution-modal',
  standalone: true,
  imports: [InputSwitchModule, CheckboxModule, ReactiveFormsModule],
  templateUrl: './addcontribution-modal.component.html',
  styleUrl: './addcontribution-modal.component.scss',
})
export class AddcontributionModalComponent {
  @ViewChild('ModalNewContrinution', { static: true }) ModalNewContrinution:
    | ElementRef
    | any;
  public wrap!: HTMLDivElement;
  public modalWrap!: HTMLDivElement;
  public animation!: Animation;
  public showForm: boolean = false;

  public addContributionForm: FormGroup = new FormGroup({
    amount: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1),
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    created_at: new FormControl('', [Validators.required]),
    objective: new FormControl('', [Validators.required]),
  });

  public btnHidden: boolean = true;

  public id: number = 0;
  public objective: string = '';
  public missing: number = 0;

  constructor(
    private readonly financesService: FinancesService,
    private readonly addContributionModalService: AddContributionModalService,
    private readonly datesService: DatesService
  ) {}

  ngOnInit(): void {
    this.wrap = document.getElementById('wrapac') as HTMLDivElement;
    this.modalWrap = this.wrap.children[0] as HTMLDivElement;

    this.animation = this.modalWrap.animate(
      [
        {
          top: '50%',
          left: '50%',
          opacity: '1',
          width: '600px',
          height: '350px',
        },
      ],
      {
        duration: 300,
        fill: 'forwards',
        iterations: 1,
      }
    );
    this.animation.pause();
    this.animation.reverse();

    this.addContributionModalService.animationEmitter.subscribe((transport) => {
      const { id, objective, amount } = transport;
      this.id = id;
      this.objective = objective;
      this.missing = amount;

      const modal = this.modalWrap.children[0] as HTMLDivElement;

      // Open sreen
      this.wrap.style.height = '100vh';

      // Put the modal into click target
      this.modalWrap.style.top = `0%`;
      this.modalWrap.style.left = `50%`;

      // Show modal
      this.modalWrap.classList.add('show');

      // Invert the animation
      this.animation.reverse();

      // Start Animation
      this.animation.play();

      // Rotate modal to show form
      setTimeout(() => {
        modal.classList.add('rotate');
        setTimeout(() => {
          this.showForm = true;
          setTimeout(() => {
            const form = document.getElementById(
              'addContributionForm'
            ) as HTMLDivElement;
            form.classList.add('pop');
          }, 50);
        }, 100);
      }, 600); //400
    });
  }

  public closeModal($event: any, click: boolean = true) {
    if (click) {
      // If click is inside modal, no emit close modal
      if (this.ModalNewContrinution.nativeElement.contains($event.target)) {
        return;
      }
    }

    const wrap = document.getElementById('wrapac') as HTMLDivElement;
    const modalWrap = wrap.children[0] as HTMLDivElement;
    const modal = modalWrap.children[0] as HTMLDivElement;

    //
    this.showForm = false;
    // Rotate modal
    modal.classList.remove('rotate');

    setTimeout(() => {
      this.animation.reverse();

      setTimeout(() => {
        modalWrap.classList.remove('show');
        // Wrap close
        wrap.style.height = '0px';

        modalWrap.style.top = `0px`;
        modalWrap.style.left = `0px`;
      }, 310);
    }, 600);
  }

  public checkIfContentSomething() {
    this.btnHidden = !this.addContributionForm.controls['title'].valid;
  }
  public onChangeInputSwitch() {
    console.log(this.addContributionForm.value);
  }

  public saveEvent() {
    this.addContributionForm.controls['created_at'].setValue(new Date());
    this.addContributionForm.controls['objective'].setValue({
      id: this.id,
      objective: this.objective,
    });

    // Valid form
    if (!this.addContributionForm.valid) {
      ErrorModal.Center.fire({ title: 'Invalid form' });
      this.showInvalids();
    }

    // Save contribution
    this.financesService
      .saveContribution(this.addContributionForm.value)
      .subscribe({
        next: (res: HttpResponse) => {
          console.log(res);
          this.addContributionForm.reset();
          this.closeModal(null, false);
        },
        error: (error) => console.log(error),
      });
  }

  private showInvalids() {
    for (const input in this.addContributionForm.controls) {
      const formControl = this.addContributionForm.get(input);
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
}
