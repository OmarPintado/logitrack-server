import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Credit } from './credit.entity';
import { Collaborator } from './collaborator.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text')
    password: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['admin'],
    })
    roles: string[];

    @Column('text', { nullable: true, default: null })
    url_profile: string;

    @OneToMany(() => Collaborator, (collaborator) => collaborator.admin)
    collaborators: Collaborator[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
