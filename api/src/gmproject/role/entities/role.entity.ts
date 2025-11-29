import { Permission } from "src/gmproject/permission/entities/permission.entity";
import { User } from "src/gmproject/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({database: 'gmproject', name: 'role'})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 50})
    key: string;

    @Column({length: 100})
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({default: true})
    isActive: boolean;

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions: Permission[];

    @ManyToMany(() => User, user => user.roles)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
