import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DateModalService } from '../../../shared/services/modals/date-modal.service';

@Component({
  selector: 'app-new-event-modal',
  standalone: true,
  imports: [InputSwitchModule, CheckboxModule, ReactiveFormsModule],
  templateUrl: './new-event-modal.component.html',
  styleUrl: './new-event-modal.component.scss',
})
export class NewEventModalComponent implements OnInit {
  @ViewChild('ModalDateWrap', { static: true }) ModalDateWrap: ElementRef | any;
  public wrap!: HTMLDivElement;
  public modalWrap!: HTMLDivElement;

  // public blur: any;
  public animation!: Animation;

  public showForm: boolean = false;

  public newEventForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    all_day: new FormControl(false, Validators.required),
    star_day: new FormControl('', Validators.required),
    end_day: new FormControl('', Validators.required),
    star_hour: new FormControl('', Validators.required),
    end_hour: new FormControl('', Validators.required),
    alert: new FormControl(false, Validators.required),
    options_alert: new FormControl(''),
    repeat: new FormControl(false, Validators.required),
    options_repeat_one: new FormControl(''),
    options_repeat_two: new FormControl(''),
    options_repeat_three: new FormControl(''),
    options_repeat_four: new FormControl(''),
  });

  public btnHidden: boolean = true;

  constructor(private readonly dateModalService: DateModalService) {}

  ngOnInit(): void {
    this.wrap = document.getElementById('wrap') as HTMLDivElement;
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

    this.dateModalService.animationEmitter.subscribe((data) => {
      const { x, y, day } = data;

      // Put the clicked number
      const modal = this.modalWrap.children[0] as HTMLDivElement;
      const number = (modal.children[0] as HTMLDivElement)
        .children[0] as HTMLDivElement;
      number.innerHTML = day;

      // Open sreen
      this.wrap.style.height = '100vh';

      // Put the modal into click target
      this.modalWrap.style.top = `${y}px`;
      this.modalWrap.style.left = `${x}px`;

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
              'newEventForm'
            ) as HTMLDivElement;
            form.classList.add('pop');
          }, 50);
        }, 100);
      }, 400);
    });

    // setTimeout(() => {
    //   this.showForm = true;
    //   setTimeout(() => {
    //     const form = document.getElementById('newEventForm') as HTMLDivElement;
    //     form.classList.add('pop');
    //   }, 500);
    // }, 2000);
  }

  public closeDateModal($event: any) {
    // If click is inside modal, no emit close modal
    if (this.ModalDateWrap.nativeElement.contains($event.target)) {
      return;
    }

    const wrap = document.getElementById('wrap') as HTMLDivElement;
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
    this.btnHidden = !this.newEventForm.controls['title'].valid;
  }
  public onChangeInputSwitch() {
    console.log(this.newEventForm.value);
  }

  public saveEvent() {
    console.log(this.newEventForm.value);
  }
}
