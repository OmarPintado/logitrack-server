import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Credit } from './credit.entity';
import { InstallmentStatus } from '../models/installment-status.enum';
import { PartialPayment } from './partial-payment.entity';

@Entity('installments')
export class Installment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal')
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    pendingAmount: number;

    @Column('enum', {
        enum: InstallmentStatus,
        default: InstallmentStatus.PENDING,
    })
    status: InstallmentStatus;

    @Column('date')
    dueDate: Date;

    @ManyToOne(() => Credit, (credit) => credit.installments, {
        onDelete: 'CASCADE',
    })
    credit: Credit;

    @OneToMany(
        () => PartialPayment,
        (partialPayment) => partialPayment.installment,
    )
    partialPayments: PartialPayment[];
}
