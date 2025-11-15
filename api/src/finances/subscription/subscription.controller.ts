import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';

@ApiTags('subscriptions')
@Controller('finances/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully', type: Subscription })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<HttpResponse> {
    const subscription = await this.subscriptionService.create(createSubscriptionDto);
    return new HttpResponse(true, 'Subscription created successfully', subscription);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: 200, description: 'List of all subscriptions', type: [Subscription] })
  async findAll(): Promise<HttpResponse> {
    const subscriptions = await this.subscriptionService.findAll();
    return new HttpResponse(true, 'The subscriptions were found', subscriptions);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active subscriptions' })
  @ApiResponse({ status: 200, description: 'List of active subscriptions', type: [Subscription] })
  async findActiveSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionService.findActiveSubscriptions();
  }

  @Get('with-theme')
  @ApiOperation({ summary: 'Get subscriptions with custom icons or colors' })
  @ApiResponse({ status: 200, description: 'List of subscriptions with custom theme', type: [Subscription] })
  async findSubscriptionsWithCustomTheme(): Promise<Subscription[]> {
    return await this.subscriptionService.findSubscriptionsWithCustomTheme();
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get subscriptions by category' })
  @ApiResponse({ status: 200, description: 'List of subscriptions by category', type: [Subscription] })
  async findByCategory(@Param('categoryId') categoryId: string): Promise<Subscription[]> {
    return await this.subscriptionService.findByCategory(+categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Subscription found', type: Subscription })
  async findOne(@Param('id') id: string): Promise<Subscription> {
    return await this.subscriptionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully', type: Subscription })
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    return await this.subscriptionService.update(+id, updateSubscriptionDto);
  }

  @Patch(':id/theme')
  @ApiOperation({ summary: 'Update subscription theme (icon and color)' })
  @ApiResponse({ status: 200, description: 'Subscription theme updated successfully', type: Subscription })
  async updateTheme(
    @Param('id') id: string, 
    @Body() themeDto: { icon?: string; color?: string }
  ): Promise<Subscription> {
    return await this.subscriptionService.updateSubscriptionTheme(+id, themeDto.icon, themeDto.color);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subscription' })
  @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.subscriptionService.remove(+id);
  }
}
