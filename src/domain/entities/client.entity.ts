import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Credit } from './credit.entity';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    dni: string;

    @Column('text', { nullable: true })
    phone: string;

    @Column('text', { nullable: true })
    address: string;

    @OneToMany(() => Credit, (credit) => credit.client)
    credits: Credit[];
}
