import { ConflictException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HttpResponse } from 'src/core/models/http/HttpResponse.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'gmproject')
    private userRepository: Repository<User>
  ) { }


  /**
   * Crea un nuevo usuario en el sistema
   * 
   * @param {CreateUserDto} createUserDto - Datos del usuario a crear
   * @returns {Promise<HttpResponse<User>>} Respuesta HTTP con el usuario creado
   * @throws {ConflictException} Si el username o email ya existe
   * 
   * @example
   * const user = await userService.create({
   *   name: 'Gerardo Martínez',
   *   username: 'gerardo',
   *   email: 'gerardo@example.com',
   *   password: 'SecureP@ss123'
   * });
   */
  async create(createUserDto: CreateUserDto): Promise<HttpResponse<User>> {
    // Validar si ya existe un usuario con el mismo username o email
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
    }

    const newUser = this.userRepository.create(createUserDto);
    const newUserSaved = await this.userRepository.save(newUser);
    return new HttpResponse<User>(true, 'User created successfully', newUserSaved);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
    // return `This action removes a #${id} user`;
  }
}
