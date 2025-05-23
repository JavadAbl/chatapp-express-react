import { LoginDTO } from "../schemes/login.scheme.js";
import { RegisterDTO } from "../schemes/register.scheme.js";
import { UserDTO } from "./dto/user.dto.js";

export interface AuthServiceInterface {
  register: (data: RegisterDTO) => Promise<UserDTO>;

  login: (data: LoginDTO) => Promise<UserDTO>;
}
