import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { PeopleService } from '../people/people.service';
import { CreateUserDto } from './dto/create.user.dto';
import { RolService } from '../rol/rol.service';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update.user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly peopleService: PeopleService,
        private readonly rolService: RolService,
    ) { }

    async findAll(): Promise<Omit<UserEntity, 'password'>[]> {
        try {
            const users = await this.userRepository.find();
            if (users.length === 0) {
                throw new NotFoundException({ message: "no se encontraron usuarios" })
            }
            const usersWithoutPassword = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return usersWithoutPassword;
        } catch (error) {
            throw error;
        }
    }
    async findByEmail(email: string): Promise<Omit<UserEntity, 'password'>> {
        try {
            const user = await this.userRepository.findOne({ where: { people: { email } } });
            if (!user) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async findByUsername(username: string): Promise<Omit<UserEntity, 'password'>> {
        try {
            const user = await this.userRepository.findOne({ where: { user: username } });
            if (!user) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<Omit<UserEntity, 'password'>> {
        try {
            const user = await this.userRepository.findOne(
                {
                    where: { id },
                    relations: {
                        people: {
                            typeDni: true
                        },
                        rol: true,
                    }
                });
            if (!user) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            }
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    private async findByIdWithPassword(id: number): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne(
                {
                    where: { id },
                    relations: {
                        people: {
                            typeDni: true
                        },
                        rol: true,
                    }
                });
            if (!user) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    private async findByUsernameWithPassword(username: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne({ where: { user: username } });
            if (!user) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        try {
            const existsDni = await this.peopleService.findByDniAndEmail(user.people.dni, user.people.email);
            if (existsDni) {
                throw new BadRequestException({ message: "la persona con ese dni ya existe o el email ya esta registrado" })
            };
            if (user.user) {
                const existsUser = await this.userRepository.findOne({ where: { user: user.user } });
                if (existsUser) {
                    throw new BadRequestException({ message: "el usuario con ese usuario ya existe" })
                };
            }
            if(user.people.phone){
                const existsPhone=await this.userRepository.findOne({where:{people:{phone:user.people.phone}}});
                if(existsPhone){
                    throw new BadRequestException({message:"la persona con ese telefono ya existe"})
                };
            }

            if (!user.rol) {
                const rolDefault = await this.rolService.findByName("cliente");
                if (!rolDefault) {
                    throw new NotFoundException({ message: "rol no encontrado" })
                };
                user.rol = rolDefault;
            }
            const rol = await this.rolService.findById(user.rol.id);
            if (!rol) {
                throw new NotFoundException({ message: "rol no encontrado" })
            };

            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(user.password, salt);
                user.password = passwordHash;
            }
            const people = await this.peopleService.create(user.people);
            user.people = people;
            const newUser = this.userRepository.create(user);
            const savedUser = await this.userRepository.save(newUser);
            return savedUser;

        } catch (error) {
            throw error;
        }
    }

    async updateUser(id: number, user: UpdateUserDto, decodedToken:any): Promise<Omit<UserEntity, 'password'>> {
        try {
            const userExist = await this.findByIdWithPassword(id);
            if(userExist.id!=decodedToken.id && decodedToken.rol!="admin" && decodedToken.rol!="vendedor"){
                throw new BadRequestException({message:"no tienes permisos para actualizar este usuario"})
            }
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };

            if (user.people) {
                if (user.people.dni && user.people.dni !== userExist.people.dni) {
                    const existsDni = await this.peopleService.findByDni(user.people.dni);
                    if (existsDni) {
                        throw new BadRequestException({ message: "la persona con ese dni ya existe" })
                    };
                }
                if (user.people.email && user.people.email !== userExist.people.email) {
                    const existsEmail = await this.peopleService.findByEmail(user.people.email);
                    if (existsEmail) {
                        throw new BadRequestException({ message: "la persona con ese email ya existe" })
                    };
                }

                if (user.people.name) userExist.people.name = user.people.name;
                if (user.people.lastname) userExist.people.lastname = user.people.lastname;
                if (user.people.phone) userExist.people.phone = user.people.phone;
                if (user.people.birthdate) userExist.people.birthdate = user.people.birthdate;
                if (user.people.email) userExist.people.email = user.people.email;
                if (user.people.dni) userExist.people.dni = user.people.dni;
                if (user.people.typeDni) userExist.people.typeDni = user.people.typeDni;
                userExist.people=await this.peopleService.update(userExist.people.id, userExist.people);
            }

            if (user.user && user.user !== userExist.user && decodedToken.rol =="admin") {
                const existsUser = await this.findByUsername(user.user);
                if (existsUser) {
                    throw new BadRequestException({ message: "el usuario con ese nombre ya existe" })
                };
                userExist.user = user.user;
            }

            if (user.password && decodedToken.rol =="admin") {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(user.password, salt);
                userExist.password = passwordHash;
            }

            if (user.rol && decodedToken.rol =="admin") {
                const rol = await this.rolService.findById(user.rol.id);
                if (!rol) {
                    throw new NotFoundException({ message: "rol no encontrado" })
                };
                userExist.rol = rol;
            }

            const updatedUser = await this.userRepository.save(userExist);
            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            const userExist = await this.findById(id);
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };
            await this.userRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async verifyUser(id: number): Promise<Omit<UserEntity, 'password'>> {
        try {
            const userExist = await this.findByIdWithPassword(id);
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };
            userExist.verify = true;
            userExist.token = null;
            userExist.verificationCode = null;
            userExist.datesendverify = null;
            const updatedUser = await this.userRepository.save(userExist);
            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async blockUser(id: number): Promise<Omit<UserEntity, 'password'>> {
        try {
            const userExist = await this.findByIdWithPassword(id);
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };
            userExist.verify = false;
            const updatedUser = await this.userRepository.save(userExist);
            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }
    async unblockUser(id: number): Promise<Omit<UserEntity, 'password'>> {
        try {
            const userExist = await this.findByIdWithPassword(id);
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };
            userExist.verify = true;
            userExist.token = null;
            userExist.verificationCode = null;
            userExist.datesendverify = null;
            const updatedUser = await this.userRepository.save(userExist);
            const { password, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    async login(user: LoginDto): Promise<UserEntity> {
        try {
            const userExist = await this.findByUsernameWithPassword(user.user);
            if (!userExist) {
                throw new NotFoundException({ message: "usuario no encontrado" })
            };
            if (!userExist.password) {
                throw new BadRequestException({ message: "la contraseña no esta definida" })
            };
            if (!userExist.verify || userExist.token || userExist.verificationCode || userExist.datesendverify) {
                throw new BadRequestException({ message: "el usuario no esta verificado" })
            };
            const isMatch = await bcrypt.compare(user.password, userExist.password);
            if (!isMatch) {
                throw new BadRequestException({ message: "la contraseña no es correcta" })
            };
            return userExist;
        } catch (error) {
            throw error;
        }
    }

    async getUserInfoDni(dni:string):Promise<Omit<UserEntity,"password">>{
        try {
            const userExist=await this.userRepository.findOne({
                where:{
                    people:{
                        dni:dni
                    }
                },
                relations:{
                    people:{
                        typeDni:true
                    },
                    rol:true
                }
            });
            if(!userExist){
                throw new NotFoundException({message:"usuario no encontrado"})
            }
            const {password,...userWithoutPassword}=userExist;
            return userExist;
        } catch (error) {
            throw error;
        }
    }

}
