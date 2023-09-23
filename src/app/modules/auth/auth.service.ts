import { ILoginUser } from './auth.interfaces';
import { User } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { selectUserProperties } from './auth.constants';
import bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';

const signUp = async (data: User) => {
  const saltRounds = 10; // You can adjust the number of rounds for security
  const salt = await bcrypt.genSalt(saltRounds);
  // Hash the user's password with the generated salt
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword, // Store the hashed password in the database
    },
    select: selectUserProperties,
  });
  return result;
};
const login = async (data: ILoginUser) => {
  // console.log('password from service, given', data.password);
  const user = await prisma.user.findUnique({
    where: {
      email: data?.email,
    },
  });
  const isPasswordMatch = await bcrypt.compare(
    data.password,
    user?.password as string
  );
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password did not match.');
  }

  // create token
  const payload = { role: user?.role, userId: user?.studentId };
  const token = jwtHelpers.createToken(
    payload,
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  return token;
};
export const AuthService = {
  signUp,
  login,
};
