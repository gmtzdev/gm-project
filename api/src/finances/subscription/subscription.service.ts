import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription, 'finance')
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      renewalDate: new Date(createSubscriptionDto.renewalDate),
      startDate: new Date(createSubscriptionDto.startDate),
      isActive: createSubscriptionDto.isActive ?? true,
      icon: createSubscriptionDto.icon || null,
      color: createSubscriptionDto.color || null,
      category: createSubscriptionDto.category ? createSubscriptionDto.category : null,
    });
    
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { visible: true },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({
      where: { id, visible: true },
      relations: ['category'],
    });
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const updateData: any = { ...updateSubscriptionDto };
    
    if (updateSubscriptionDto.renewalDate) {
      updateData.renewalDate = new Date(updateSubscriptionDto.renewalDate);
    }
    
    if (updateSubscriptionDto.startDate) {
      updateData.startDate = new Date(updateSubscriptionDto.startDate);
    }

    // if (updateSubscriptionDto.categoryId !== undefined) {
    //   updateData.category = updateSubscriptionDto.categoryId ? { id: updateSubscriptionDto.categoryId } : null;
    // }

    // Handle icon and color updates explicitly
    if (updateSubscriptionDto.icon !== undefined) {
      updateData.icon = updateSubscriptionDto.icon || null;
    }

    if (updateSubscriptionDto.color !== undefined) {
      updateData.color = updateSubscriptionDto.color || null;
    }

    updateData.updated_at = new Date();

    await this.subscriptionRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Soft delete by setting visible to false
    await this.subscriptionRepository.update(id, { 
      visible: false, 
      updated_at: new Date() 
    });
  }

  async findActiveSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { 
        visible: true, 
        isActive: true 
      },
      relations: ['category'],
      order: { renewalDate: 'ASC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { 
        visible: true,
        category: { id: categoryId }
      },
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  async findSubscriptionsWithCustomTheme(): Promise<Subscription[]> {
    return await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.category', 'category')
      .where('subscription.visible = :visible', { visible: true })
      .andWhere('(subscription.icon IS NOT NULL OR subscription.color IS NOT NULL)')
      .orderBy('subscription.created_at', 'DESC')
      .getMany();
  }

  async updateSubscriptionTheme(id: number, icon?: string, color?: string): Promise<Subscription> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (icon !== undefined) {
      updateData.icon = icon || null;
    }

    if (color !== undefined) {
      updateData.color = color || null;
    }

    await this.subscriptionRepository.update(id, updateData);
    return this.findOne(id);
  }
}
