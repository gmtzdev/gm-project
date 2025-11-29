import { Permission } from 'src/gmproject/permission/entities/permission.entity';
import { Role } from 'src/gmproject/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';

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

    @Column({ type: 'timestamp', default: () => {return 'CURRENT_TIMESTAMP'}})
    createAt: Date;

    @Column({ nullable: true})
    authStrategy: string;

    @ManyToMany(() => Permission, permission => permission.users)
    @JoinTable({
        name: 'user_permissions',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions: Permission[];

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[];

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
