import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { PaymenthMethodEntity } from 'src/modules/paymenthmethod/entity/paymenthMethod.entity';
import { PaymentStatusEntity } from 'src/modules/paymentstatus/entity/paymentstatus.entity';
import { RolEntity } from 'src/modules/rol/entity/rol.entity';
import { StatusShipmentEntity } from 'src/modules/statusshipment/entity/statusshipment.entity';
import { TypeDniEntity } from 'src/modules/typedni/entity/typedni.entity';
import { TypeMeasureEntity } from 'src/modules/typemeasure-medida/entity/typemeasure.entity';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ADMIN_PASSWORD } from '../constant';
import { PeopleEntity } from 'src/modules/people/entity/people.entity';

@Injectable()
export class SeedersService  implements OnModuleInit{
    constructor(
        @InjectRepository(TypeDniEntity)
        private readonly typeDniRepository: Repository<TypeDniEntity>,
        @InjectRepository(RolEntity)
        private readonly rolRepository: Repository<RolEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(PaymenthMethodEntity)
        private readonly paymenthMethodRepository: Repository<PaymenthMethodEntity>,
        @InjectRepository(PaymentStatusEntity)
        private readonly paymentStatusRepository: Repository<PaymentStatusEntity>,
        @InjectRepository(StatusShipmentEntity)
        private readonly statusShipmentRepository: Repository<StatusShipmentEntity>,
        @InjectRepository(TypeMeasureEntity)
        private readonly typeMeasureRepository: Repository<TypeMeasureEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly configService:ConfigService,
        @InjectRepository(PeopleEntity)
        private readonly peopleRepository:Repository<PeopleEntity>
    ) { }

    async onModuleInit() {


        const countTypeDni = await this.typeDniRepository.count();
        if (countTypeDni == 0) {
            await this.typeDniRepository.save([
                {
                    name: 'CC',
                },
                {
                    name: 'CE',
                },
                {
                    name: 'PP',
                },
                {
                    name: 'TI',
                },
                {
                    name: 'NIT',
                }
            ]);
            console.log("Tipos de documento de identidad creados correctamente");
        };



        const countRol = await this.rolRepository.count();
        if (countRol == 0) {
            await this.rolRepository.save([
                {
                    rol: "admin"
                },
                {
                    rol: "cliente"
                },
                {
                    rol: "vendedor"
                },
                {
                    rol: "proveedor"
                }
            ])
            console.log("Roles creados correctamente");
        };




        const countCategory = await this.categoryRepository.count();
        if (countCategory == 0) {
            await this.categoryRepository.save([
                {
                    category: "granos"
                },
                {
                    category: "frutas"
                },
                {
                    category: "enlatados"
                }
            ]);
            console.log("Categorías creadas correctamente");
        };



        const countPaymenthMethod = await this.paymenthMethodRepository.count();
        if (countPaymenthMethod == 0) {
            await this.paymenthMethodRepository.save([
                {
                    method: "efectivo"
                },
                {
                    method: "transferencia"
                },
                {
                    method: "tarjeta"
                }
            ]);
            console.log("Métodos de pago creados correctamente");
        };

        const countPaymentStatus = await this.paymentStatusRepository.count();
        if (countPaymentStatus == 0) {
            await this.paymentStatusRepository.save([
                {
                    status: "pendiente"
                },
                {
                    status: "aprobado"
                },
                {
                    status: "rechazado"
                }
            ]);
            console.log("Estados de pago creados correctamente");
        };



        const countStatusShipment = await this.statusShipmentRepository.count();
        if (countStatusShipment == 0) {
            await this.statusShipmentRepository.save([
                {
                    status: "pendiente"
                },
                {
                    status: "en preparacion"
                },
                {
                    status: "enviado"
                },
                {
                    status: "entregado"
                }
            ]);
            console.log("Estados de envío creados correctamente");
        };



        const countTypeMeasure = await this.typeMeasureRepository.count();
        if (countTypeMeasure == 0) {
            await this.typeMeasureRepository.save([
                {
                    measure: "kilogramo"
                },
                {
                    measure: "gramo"
                },
                {
                    measure: "litro"
                },
                {
                    measure: "unidad"
                }
            ]);
            console.log("Medidas creadas correctamente");

        };

        
        const countUser = await this.userRepository.count({
            where:{
                user:"admin",
                people:{
                    email:"admin@admin.com",
                    dni:"0000000000"
                }
            }
        })
        if(countUser == 0){
            const rol= await this.rolRepository.findOne({
                where:{
                    rol:"admin"
                }
            });
            if(!rol){
                throw new BadRequestException("el rol de administrador no esta definido")
            }
            const typeDni= await this.typeDniRepository.findOne({
                where:{
                    name:"CC"
                }
            })
            if(!typeDni){
                throw new BadRequestException("el tipo de documento de identidad no esta definido")
            }
            const password=this.configService.get<string>(ADMIN_PASSWORD);
            if(!password){
                throw new BadRequestException("la contraseña de primer administrador no esta definida")
            }
            const salt=bcrypt.genSaltSync(10);
            const hash=bcrypt.hashSync(password,salt);
            const people=new PeopleEntity();
            people.name="admin";
            people.birthdate="1990-01-01";
            people.typeDni=typeDni;
            people.dni="0000000000";
            people.lastname="admin";
            people.phone="0000000";
            people.email="admin@admin.com";

            const peopleSaved= await this.peopleRepository.save(people);
            const user = await this.userRepository.save({
                user:"admin",
                people:peopleSaved,
                password:hash,
                rol:rol,
                verify:true,
            })
            console.log("primer administrador creado correctamente");
        }

    }
}
