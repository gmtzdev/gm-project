import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity({database: 'gmproject', name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, default: null })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    // @Column({ default: false })
    // isActive: boolean;

    @Column({ type: 'timestamp', default: () => {return 'CURRENT_TIMESTAMP'}})
    createAt: Date;

    @Column({ nullable: true})
    authStrategy: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
