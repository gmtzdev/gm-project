import { Category } from "./Category.model";

export class Subscription {
    id: number;
    name: string; // e.g., Netflix, Disney+, Spotify
    provider: string; // e.g., Netflix Inc., Disney, Spotify AB
    price: number; // Monthly cost
    currency: string; // e.g., USD, EUR, MXN
    renewalDate: Date | string; // Next renewal date
    startDate: Date; // When subscription started
    isActive: boolean; // Subscription status
    billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily'; // monthly, yearly, weekly
    description: string; // Additional notes
    website: string; // Subscription service website
    email: string; // Account email for this subscription
    visible: boolean; // For soft delete functionality
    icon: string;
    color: string;
    created_at: Date;
    updated_at: Date;
    category: Category; // e.g., Entertainment, Music, Productivity

    constructor(subscription: any) {
        this.id = subscription.id;
        this.name = subscription.name;
        this.provider = subscription.provider;
        this.price = subscription.price;
        this.currency = subscription.currency;
        this.renewalDate = subscription.renewalDate;
        this.startDate = subscription.startDate;
        this.isActive = subscription.isActive;
        this.billingCycle = subscription.billingCycle;
        this.description = subscription.description;
        this.website = subscription.website;
        this.email = subscription.email;
        this.visible = subscription.visible;
        this.icon = subscription.icon;
        this.color = subscription.color;
        this.created_at = subscription.created_at;
        this.updated_at = subscription.updated_at;
        this.category = subscription.category;
    }
}
