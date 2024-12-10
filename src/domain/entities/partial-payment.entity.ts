import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
import { Installment } from './installment.entity';

@Entity('partial_payments')
export class PartialPayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Installment,
        (installment) => installment.partialPayments,
        {
            onDelete: 'CASCADE',
        },
    )
    installment: Installment;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;
}
