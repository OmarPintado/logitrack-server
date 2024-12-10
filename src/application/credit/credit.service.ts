import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client, Credit, Installment, User } from '../../domain/entities';
import { Repository } from 'typeorm';
import { CreateCreditDto } from './dto/create-credit.dto';
import { InstallmentStatus } from '../../domain/models/installment-status.enum';

@Injectable()
export class CreditService {
    constructor(
        @InjectRepository(Credit)
        private readonly creditRepository: Repository<Credit>,
        @InjectRepository(Installment)
        private readonly installmentRepository: Repository<Installment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    async create(createCreditDto: CreateCreditDto): Promise<Credit> {
        const {
            amount,
            interestRate,
            dueDate,
            collaboratorId,
            clientId,
            numInstallments,
        } = createCreditDto;

        const collaborator = await this.userRepository.findOne({
            where: { id: collaboratorId },
        });

        const client = await this.clientRepository.findOne({
            where: { id: clientId },
        });

        if (!collaborator) {
            throw new NotFoundException(
                `Collaborator with ID ${collaboratorId} not found`,
            );
        }

        if (!client) {
            throw new NotFoundException(`Client with ID ${clientId} not found`);
        }

        const credit = this.creditRepository.create({
            amount,
            interestRate,
            dueDate,
            collaborator,
            client,
        });

        await this.creditRepository.save(credit);

        // Calcular las cuotas según el interés francés
        const monthlyInterestRate = interestRate / 12 / 100;
        const monthlyPayment =
            (amount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -numInstallments));

        const installments: Installment[] = [];
        let remainingAmount = amount;

        for (let i = 1; i <= numInstallments; i++) {
            const interestForPeriod = remainingAmount * monthlyInterestRate;
            const principalForPeriod = monthlyPayment - interestForPeriod;
            remainingAmount -= principalForPeriod;

            const installment = this.installmentRepository.create({
                amount: monthlyPayment,
                pendingAmount: monthlyPayment,
                status: InstallmentStatus.PENDING,
                dueDate: new Date(
                    dueDate.getFullYear(),
                    dueDate.getMonth() + i,
                    dueDate.getDate(),
                ),
                credit,
            });

            installments.push(installment);
        }

        await this.installmentRepository.save(installments);

        return credit;
    }
}
