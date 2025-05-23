import { PrismaClient, User } from "#generated/prisma/index.js";
import { AuthServiceInterface } from "../types/auth-service.type.js";
import { compare, hash } from "bcryptjs";
import { RegisterDTO } from "../schemes/register.scheme.js";
import { inject, injectable } from "inversify";
import { ITypes } from "#shared/types/inversify.type.js";
import { UserDTO, UserDTOSchema } from "../types/dto/user.dto.js";
import { AppError } from "#shared/middlewars/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import { writeFile, mkdir, access, constants } from "fs/promises";
import { join } from "path";
import { AppHelper } from "#shared/helpers/app-helper.js";
import { LoginDTO } from "../schemes/login.scheme.js";

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(@inject(ITypes.PrismaClient) private readonly prisma: PrismaClient) {}

  //login---------------------------------------------------
  async login(loginDTO: LoginDTO): Promise<UserDTO> {
    const user = await this.getUserByUsername(loginDTO.username);
    if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

    const isPasswordValid = await this.comparePassword(loginDTO.password, user.password);
    if (!isPasswordValid) throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);

    return UserDTOSchema.parse(user);
  }

  //register---------------------------------------------------
  public async register(registerDTO: RegisterDTO): Promise<UserDTO> {
    const user = await this.getUserByUsername(registerDTO.username);
    if (user) throw new AppError("User already exists", StatusCodes.BAD_REQUEST);

    let profileImage;
    if (registerDTO.profileImage) profileImage = await this.createProfileImage(registerDTO.profileImage);

    const newUser = await this.createUser(registerDTO);
    if (!newUser) throw new AppError("User not created", StatusCodes.INTERNAL_SERVER_ERROR);

    newUser.profileImage = profileImage ?? null;
    return newUser;
  }

  //createProfileImage---------------------------------------------
  private async createProfileImage(profileImage: string): Promise<string> {
    const buffer = Buffer.from(profileImage, "base64");

    if (!/^[A-Za-z0-9+/=]+$/.test(profileImage)) {
      throw new AppError("Invalid base64 image data", StatusCodes.BAD_REQUEST);
    }

    const dir = join(__dirname, "public", "profile-images");
    try {
      await access(dir, constants.F_OK);
    } catch {
      await mkdir(dir, { recursive: true });
    }

    const filePath = join(dir, `${AppHelper.generateUniqueString()}.png`);
    await writeFile(filePath, buffer);

    return `/public/profile-images/${filePath}`;
  }

  //getUserByUsername---------------------------------------------
  private async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  //createUser---------------------------------------------------
  private async createUser(registerDTO: RegisterDTO): Promise<UserDTO> {
    const hashedPassword = await this.hashPassword(registerDTO.password);

    const user = await this.prisma.user.create({
      data: {
        ...registerDTO,
        password: hashedPassword,
      },
    });

    return UserDTOSchema.parse(user);
  }

  //hashPassword---------------------------------------------
  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  //comparePassword---------------------------------------------
  private comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
