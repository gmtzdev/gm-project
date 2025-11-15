export interface CreateSubscriptionDto {
    name: string; // e.g., Netflix, Disney+, Spotify
    provider?: string; // e.g., Netflix Inc., Disney, Spotify AB
    price: number; // Monthly cost
    currency: string; // e.g., USD, EUR, MXN
    renewalDate: string; // Next renewal date (ISO string)
    startDate: string; // When subscription started (ISO string)
    isActive?: boolean; // Subscription status (defaults to true)
    billingCycle?: string; // monthly, yearly, weekly
    description?: string; // Additional notes
    website?: string; // Subscription service website
    email?: string; // Account email for this subscription
    icon?: string; // Icon for the subscription (e.g., FontAwesome icon name, emoji, or URL)
    color?: string; // Color theme for the subscription (hex code or color name)
    category?: number; // Category ID for relationship
}
