import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from './collaborator.entity';
import { Client } from './client.entity';
import { Installment } from './installment.entity';
import { User } from './user.entity';

@Entity('credits')
export class Credit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal')
    amount: number;

    @Column('decimal')
    interestRate: number;

    @Column('date')
    dueDate: Date;

    @ManyToOne(() => Collaborator, (collaborator) => collaborator.credits)
    collaborator: Collaborator;

    @ManyToOne(() => Client, (client) => client.credits)
    client: Client;

    @OneToMany(() => Installment, (installment) => installment.credit)
    installments: Installment[];
}
