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
  async create(createUserDto: CreateUserDto): Promise<User> {
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
    return newUserSaved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id })
  }

  /**
   * Actualiza un usuario existente
   * 
   * @param {number} id - ID del usuario a actualizar
   * @param {UpdateUserDto} updateUserDto - Datos a actualizar
   * @returns {Promise<User>} Respuesta HTTP con el usuario actualizado
   * @throws {ConflictException} Si el username o email ya existe en otro usuario
   * @throws {NotFoundException} Si el usuario no existe
   * 
   * @example
   * const user = await userService.update(1, {
   *   name: 'Gerardo Martínez Updated',
   *   email: 'newemail@example.com'
   * });
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id });
  
    if (!user) {
      // throw new ConflictException('User not found');
      return null;
    }

    // Validar username único si se está actualizando
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username }
      });
      
      if (existingUsername) {
        throw new ConflictException('Username already exists');
      }
    }

    // Validar email único si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Actualizar el usuario
    await this.userRepository.update(id, updateUserDto);
  
    // Obtener el usuario actualizado
    const updatedUser = await this.userRepository.findOneBy({ id });
  
    return updatedUser;
  }

  async remove(id: number): Promise<boolean | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      // throw new ConflictException('User not found');
      return null;
    }
    const result = await this.userRepository.delete(id);
    if(result.affected === 0){
      // throw new ConflictException('User could not be deleted');
      return false;
    }
    return true;
  }


  async findByEmail(email: string): Promise<User | null> { 
    return this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> { 
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
