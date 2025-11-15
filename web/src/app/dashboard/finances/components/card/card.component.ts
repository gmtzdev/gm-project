import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CardHome } from '../../core/models/CardHome.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FinancesService } from '../../core/services/finances.service';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="header-card">
        <i class="fa-solid {{ card.icon }} icon" (click)="iconClick()"></i>

        <button
          class="btn"
          (click)="navigate(card.destination)"
          [hidden]="card.destination == ''"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>

      <div class="title">
        <span (click)="titleClick()">{{ card.title }}</span>
      </div>

      <div class="subject">
        <span>{{ card.subject }}</span> <span>{{ card.subtitle }}</span>
      </div>

      @if (card.id === 4) {
      <div class="spending-cap-container">
        <div class="spending-cap-border"></div>
        <div class="spending-cap">
          <div #levelBar class="level"></div>
        </div>
        <div #toolTipInfo class="tooltip-info">
          <div class="info">
            <div class="title">Amount</div>
            <div class="amount">{{ this.amount }}</div>
            <div class="percentage">{{ this.percentage }}</div>
          </div>
        </div>
        <div #toolTipArrow class="triangle"></div>
      </div>

      <div class="checkbox-readypay-container">
        <div class="checkbox-readypay-body">
          <input id="payCheckBox" type="checkbox" disabled [checked]="this.wasPaid">
          <label for="payCheckBox">
            <i class="fa-solid fa-check"></i>
          </label>
        </div>
      </div>
      }
    </div>
  `,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() card: CardHome = {
    id: 0,
    icon: '',
    destination: '',
    title: '',
    subtitle: '',
    subject: '',
    aditional: [],
  };
  @Output() onIconClicked = new EventEmitter<number>();
  @Output() onTitleClicked = new EventEmitter<number>();

  @ViewChild('levelBar')
  levelBar!: ElementRef;
  @ViewChild('toolTipInfo')
  toolTipInfo!: ElementRef;
  @ViewChild('toolTipArrow')
  toolTipArrow!: ElementRef;

  public amount: string = '';
  public percentage: string = '';
  public wasPaid: boolean = false;

  constructor(
    private readonly renderer2: Renderer2,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly financesService: FinancesService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card']) {
      if (changes['card'].currentValue) {
        if (changes['card'].currentValue.id === 4) {
          if (this.card.aditional[1] !== undefined) {
            this.setPercentage(this.card.aditional[1]);
            this.amount = this.financesService.toMoneyFormat(
              Number.parseInt(this.card.aditional[0])
            );
            this.percentage = `${this.card.aditional[1]}%`;
            this.wasPaid = this.card.aditional[2] === 'true';
          }
        }
      }
    }
  }

  navigate(destination: string) {
    // Navigate relative to the current route
    this.router.navigate([destination], { relativeTo: this.activatedRoute });
  }

  public iconClick() {
    this.onIconClicked.emit(this.card.id);
  }

  public titleClick() {
    this.onTitleClicked.emit(this.card.id);
  }

  public setPercentage(percentage: string) {
    const levelBar = this.levelBar.nativeElement;
    const tooltipInfo = this.toolTipInfo.nativeElement;
    const tooltipArrow = this.toolTipArrow.nativeElement;

    // height 68px - 100%
    // percen x px -   y%
    const y = Number.parseInt(percentage);
    const x = (y * 68) / 100;

    // y >= 100 - top = 0
    // top + x
    let top = 68;
    if (y >= 100) top = 0;
    else top = top - x;

    this.renderer2.setStyle(levelBar, 'height', `${x}px`);
    this.renderer2.setStyle(tooltipInfo, 'top', `${top}px`);
    this.renderer2.setStyle(tooltipArrow, 'top', `${top}px`);
  }
}
