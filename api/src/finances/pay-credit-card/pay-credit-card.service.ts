import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayCreditCard } from './entities/pay-credit-card.entity';
import { Repository } from 'typeorm';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';

@Injectable()
export class PayCreditCardService {
  constructor(
    @InjectRepository(PayCreditCard, 'finance')
    private readonly paycreditcardRepository: Repository<PayCreditCard>,
  ) {}

  /**
   * Return the current period of the credit card
   *
   * @returns {Promise<PayCreditCard>}
   */
  public async getLastRegister(): Promise<PayCreditCard> {
    const result = await this.paycreditcardRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    if (result.length !== 1) {
      throw new HttpException(
        'Error searching last register',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payCreditCard = result[0];
    if (!(payCreditCard instanceof PayCreditCard)) {
      throw new HttpException(
        'Current date pay credit card was not found!!',
        HttpStatus.NOT_FOUND,
      );
    }
    return payCreditCard;
  }

  /**
   *  Add N number of days (days) to a date. Returns a new date.
   *
   * @param {Date} date - The date reference
   * @param {number} days - Number of the days to add
   * @returns {Date}
   */
  private addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }


  public async getCurrentDatePayCreditCard() {
    const result = await this.getLastRegister();
    return new HttpResponse(
      true,
      'Return current date pay credit card',
      result,
    );
  }

  /**
   * Return number of days to pay credit card
   *
   * @returns {Promise<HttpResponse>}
   */
  public async getDaysToPayCreditCard(): Promise<HttpResponse> {
    const currentDateToPay = await this.getLastRegister();
    const today = new Date();
    const timeDifference = currentDateToPay.payDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return new HttpResponse(
      true,
      `Return the remaining days to  pay the credit card.`,
      dayDifference,
    );
  }

  /**
   * Return number of days remaining to cut-off date
   * 
   * @return {Promise<HttpResponse>}
   */
  public async getDaysToCutOffCreditCard():Promise<HttpResponse>{
    const currentDayToPay = await this.getLastRegister();
    const today = new Date();
    const formerCutOffDate = currentDayToPay.cutOffDate;
    const nextCutOffDate = new Date(formerCutOffDate);
    nextCutOffDate.setMonth(nextCutOffDate.getMonth() + 1);
    const timeDifference = nextCutOffDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return new HttpResponse(true, `Return the remaining days to cut-off -date`, dayDifference);
  }

  /**
   * Create a next register from pay credit card and return
   * the days remaining to pay.
   * This reference is necesary to calculate the next amount to pay
   * and indicate the pay day
   * 
   * @return { Promise<HttpResponse> }
   */
  public async passToNextMonthCreditCard(): Promise<HttpResponse>{
    const currentDateToPay = await this.getLastRegister();
    const today = new Date();
    const nextCutOffDate = new Date(currentDateToPay.cutOffDate);
    nextCutOffDate.setMonth(nextCutOffDate.getMonth() + 1);
    if(nextCutOffDate >= today){
      throw new HttpException(`It's not time to update date to pay credit card yet`, HttpStatus.BAD_REQUEST);
    }

    const dtoPayCreditCard = new PayCreditCard();

    /// Fill object properties \\\
    // Add 1 month at the new cut-off date
    dtoPayCreditCard.cutOffDate = new Date(currentDateToPay.cutOffDate);
    dtoPayCreditCard.cutOffDate.setMonth(dtoPayCreditCard.cutOffDate.getMonth() + 1);
    // Add 30 day at the new pay date
    dtoPayCreditCard.payDate = new Date(currentDateToPay.payDate);
    dtoPayCreditCard.payDate.setTime(dtoPayCreditCard.payDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    // Set pay in false
    dtoPayCreditCard.pay = false;
    // Set now date to created_at
    dtoPayCreditCard.created_at = new Date();


    // Save new pay credit card
    const newPayCreditCard = this.paycreditcardRepository.create(dtoPayCreditCard);
    const payCreditCard = await this.paycreditcardRepository.save(newPayCreditCard);
    
    const timeDifference = payCreditCard.payDate.getTime() - today.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return new HttpResponse(true, 'The date to pay credit card was created successfully', {dayDifference});
  }
}
