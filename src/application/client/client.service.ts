import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client, Credit, Installment, User } from '../../domain/entities';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ValidRoles } from '../../domain/models/valid-roles.enum';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,

        @InjectRepository(Credit)
        private readonly creditRepository: Repository<Credit>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}

    async create(createClientDto: CreateClientDto) {
        try {
            const client = this.clientRepository.create(createClientDto);
            await this.clientRepository.save(client);

            return {
                message: `Registraste a ${client.fullName}`,
            };
        } catch (error) {
            throw new BadRequestException(`${error.message}`);
        }
    }

    async update(updateClientDto: UpdateClientDto) {
        try {
            const { idClient } = updateClientDto;
            const client = await this.clientRepository.findOne({
                where: { id: idClient },
            });

            if (!client) {
                throw new NotFoundException(
                    `Client with ID ${idClient} not found`,
                );
            }

            Object.assign(client, updateClientDto);
            await this.clientRepository.save(client);

            return client;
        } catch (error) {
            throw new BadRequestException(`${error.message}`);
        }
    }

    async getClients(user: User) {
        let clients: Client[];
        if (user.roles.includes(ValidRoles.admin)) {
            clients = await this.clientRepository.find({
                relations: ['credits'],
            });
        } else if (user.roles.includes(ValidRoles.collaborator)) {
            const credits = await this.creditRepository.find({
                where: { collaborator: user },
                relations: ['client'],
            });
            clients = credits.map((credit) => credit.client);
        } else {
            throw new ForbiddenException('Access denied');
        }

        // Construir la respuesta con la información adicional
        return await Promise.all(
            clients.map(async (client) => {
                const credits = await this.creditRepository.find({
                    where: { client },
                    relations: ['installments'],
                });

                const totalAmount = credits.reduce(
                    (sum, credit) => sum + credit.amount,
                    0,
                );
                const pendingAmount = credits.reduce((sum, credit) => {
                    const pendingInstallments = credit.installments.filter(
                        (installment) => installment.status !== 'pagado',
                    );
                    return (
                        sum +
                        pendingInstallments.reduce(
                            (sum, installment) =>
                                sum + installment.pendingAmount,
                            0,
                        )
                    );
                }, 0);

                const monthlyPayment = credits.reduce((sum, credit) => {
                    const firstInstallment = credit.installments[0];
                    return (
                        sum + (firstInstallment ? firstInstallment.amount : 0)
                    );
                }, 0);

                const nextPayment = credits.reduce(
                    (earliest, credit) => {
                        const nextInstallment = credit.installments
                            .filter(
                                (installment) =>
                                    installment.status !== 'pagado',
                            )
                            .sort(
                                (a, b) =>
                                    a.dueDate.getTime() - b.dueDate.getTime(),
                            )[0];
                        return !earliest ||
                            (nextInstallment &&
                                nextInstallment.dueDate < earliest)
                            ? nextInstallment.dueDate
                            : earliest;
                    },
                    null as Date | null,
                );

                return {
                    client,
                    totalAmount,
                    pendingAmount,
                    monthlyPayment,
                    nextPayment,
                };
            }),
        );
    }
}
