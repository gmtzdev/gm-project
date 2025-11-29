import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "src/gmproject/role/entities/role.entity";
import { User } from "src/gmproject/user/entities/user.entity";

@Entity({database: 'gmproject', name: 'permission'})
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    key: string;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 50, nullable: true})
    module: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @ManyToMany(() => User, user => user.roles)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
