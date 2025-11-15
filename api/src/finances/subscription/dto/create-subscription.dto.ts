import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Category } from 'src/finances/category/entities/category.entity';

export class CreateSubscriptionDto {
    @IsString()
    name: string; // e.g., Netflix, Disney+, Spotify

    @IsOptional()
    @IsString()
    provider?: string; // e.g., Netflix Inc., Disney, Spotify AB

    @IsNumber()
    @Min(0)
    price: number; // Monthly cost

    @IsString()
    currency: string; // e.g., USD, EUR, MXN

    @IsDateString()
    renewalDate: string; // Next renewal date (ISO string)

    @IsDateString()
    startDate: string; // When subscription started (ISO string)

    @IsOptional()
    @IsBoolean()
    isActive?: boolean; // Subscription status (defaults to true)

    @IsOptional()
    @IsString()
    billingCycle?: string; // monthly, yearly, weekly

    @IsOptional()
    @IsString()
    description?: string; // Additional notes

    @IsOptional()
    @IsString()
    website?: string; // Subscription service website

    @IsOptional()
    @IsString()
    email?: string; // Account email for this subscription

    @IsOptional()
    @IsString()
    icon?: string; // Icon for the subscription (e.g., FontAwesome icon name, emoji, or URL)

    @IsOptional()
    @IsString()
    color?: string; // Color theme for the subscription (hex code or color name)

    @IsOptional()
    @IsNumber()
    category?: Category; // Category ID for relationship
}
