import { Category } from "src/finances/category/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ database: 'finance', name: 'subscription' })
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string; // e.g., Netflix, Disney+, Spotify

    @Column({ nullable: true })
    provider: string; // e.g., Netflix Inc., Disney, Spotify AB

    @Column({ type: 'double', nullable: false })
    price: number; // Monthly cost

    @Column({ nullable: false })
    currency: string; // e.g., USD, EUR, MXN

    @Column({ type: 'date', nullable: false })
    renewalDate: Date; // Next renewal date

    @Column({ type: 'date', nullable: false })
    startDate: Date; // When subscription started

    @Column({ default: true })
    isActive: boolean; // Subscription status

    @Column({ nullable: true })
    billingCycle: string; // monthly, yearly, weekly

    @Column({ nullable: true })
    description: string; // Additional notes

    @Column({ nullable: true })
    website: string; // Subscription service website

    @Column({ nullable: true })
    email: string; // Account email for this subscription

    @Column({ default: true })
    visible: boolean; // For soft delete functionality

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    color: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Category, category => category.id, { nullable: true })
    category: Category; // e.g., Entertainment, Music, Productivity
}
