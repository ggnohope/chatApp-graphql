import { FilterQuery, Types } from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import {
  CreateGoogleUserInput,
  CreateUserInput,
} from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from 'src/modules/supabase/supabase.service';
import { TokenPayload } from 'src/interfaces/tokenPayload.interface';
import { PaginationArgs } from 'src/modules/chats/dto/pagination-chat.args';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async getCountUsers() {
    return await this.userRepository.model.countDocuments();
  }

  async getProfileImage({ _id }: { _id: string }) {
    return (await this.userRepository.findOne({ _id })).profileImage;
  }

  async uploadProfileImage(file: Express.Multer.File, user: TokenPayload) {
    const { data } = await this.supabaseService.uploadFile(file);

    return await this.update(user._id, {
      profileImage: data.publicUrl,
    });
  }

  async create(createUserInput: CreateUserInput) {
    if (await this.userRepository.findOne({ email: createUserInput.email })) {
      throw new ConflictException(' Email already exists! ');
    }

    if (
      await this.userRepository.findOne({ username: createUserInput.username })
    ) {
      throw new ConflictException(' Username already exists! ');
    }

    const hashedPassword = await this.hashPassword(createUserInput.password);
    const userToCreate = { ...createUserInput, password: hashedPassword };

    return await this.userRepository.create(userToCreate);
  }

  async createGoogleUser(createUserInput: CreateGoogleUserInput) {
    if (await this.userRepository.findOne({ email: createUserInput.email })) {
      throw new ConflictException(' Email already exists! ');
    }

    if (
      await this.userRepository.findOne({ username: createUserInput.username })
    ) {
      throw new ConflictException(' Username already exists! ');
    }

    return await this.userRepository.create(createUserInput);
  }

  async findAll(
    user: TokenPayload,
    search?: string,
    paginationArgs?: PaginationArgs,
  ) {
    const { skip = 0, limit = 10 } = paginationArgs || {};

    const matchStage = {
      $match: {
        _id: { $ne: new Types.ObjectId(user._id) },
        ...(search && {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }),
      },
    };

    try {
      const users = await this.userRepository.model.aggregate([
        matchStage,
        { $skip: skip },
        { $limit: limit },
      ]);

      return users;
    } catch (error) {
      throw new Error(`Error finding users: ${error.message}`);
    }
  }

  findOne({ _id, email }: { _id?: string; email?: string }) {
    const query: Partial<{ _id: string; email: string }> = {};
    if (_id) query._id = _id;
    if (email) query.email = email;

    return this.userRepository.findOne(query);
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const updateFields: Partial<UpdateUserInput> = { ...updateUserInput };

    if (updateUserInput.password) {
      updateFields.password = await this.hashPassword(updateUserInput.password);
    }

    return await this.userRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: updateFields,
      },
    );
  }

  async remove(id: string) {
    return await this.userRepository.findOneAndDelete({ _id: id });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        `User with email: ${email} is not found.`,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Credentials are not valid.`);
    }
    return user;
  }
}
