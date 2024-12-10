import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Installment, PartialPayment } from '../../domain/entities';
import { InstallmentStatus } from '../../domain/models/installment-status.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstallmentService {
    constructor(
        @InjectRepository(Installment)
        private readonly installmentRepository: Repository<Installment>,

        @InjectRepository(PartialPayment)
        private readonly partialPaymentRepository: Repository<PartialPayment>,
    ) {}

    async addPartialPayment(
        installmentId: string,
        amount: number,
    ): Promise<Installment> {
        const installment = await this.installmentRepository.findOne({
            where: { id: installmentId },
        });

        if (!installment) {
            throw new NotFoundException(
                `Installment with ID ${installmentId} not found`,
            );
        }

        if (installment.status === InstallmentStatus.PAID) {
            throw new BadRequestException('Installment is already paid');
        }

        const partialPayment = new PartialPayment();
        partialPayment.installment = installment;
        partialPayment.amount = amount;

        await this.partialPaymentRepository.save(partialPayment);

        installment.pendingAmount -= amount;

        if (installment.pendingAmount <= 0) {
            installment.pendingAmount = 0;
            installment.status = InstallmentStatus.PAID;
        }

        return this.installmentRepository.save(installment);
    }

    async updateInstallmentStatuses(): Promise<void> {
        const installments = await this.installmentRepository.find({
            where: [
                { status: InstallmentStatus.PENDING },
                { status: InstallmentStatus.DUE },
            ],
        });

        const today = new Date();
        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(today.getDate() + 7);

        for (const installment of installments) {
            if (
                installment.status === InstallmentStatus.DUE &&
                installment.dueDate <= today
            ) {
                installment.status = InstallmentStatus.OVERDUE;
            } else if (installment.status === InstallmentStatus.PENDING) {
                if (installment.dueDate <= today) {
                    installment.status = InstallmentStatus.OVERDUE;
                } else if (installment.dueDate <= oneWeekFromNow) {
                    installment.status = InstallmentStatus.DUE;
                }
            }
        }

        await this.installmentRepository.save(installments);
    }
}
