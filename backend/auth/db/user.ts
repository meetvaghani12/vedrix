import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (userData: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  marketingConsent?: boolean;
  twoFactorSecret?: string;
  image?: string;
  emailVerified?: Date;
}): Promise<User> => {
 
  const  userDataWithoutTypes  = userData;
  
  
  return prisma.$transaction(async (tx) => {
    // Create the user with only the user data
    const user = await tx.user.create({
      data: {
        firstName: userDataWithoutTypes.firstName,
        lastName: userDataWithoutTypes.lastName,
        email: userDataWithoutTypes.email,
        password: userDataWithoutTypes.password,
        phone: userDataWithoutTypes.phone,
        twoFactorSecret: userDataWithoutTypes.twoFactorSecret,
        image: userDataWithoutTypes.image,
        emailVerified: userDataWithoutTypes.emailVerified
      },
    });

    return user;
  });
};

export const updateUser = async (email: string, data: Partial<Prisma.UserUpdateInput>): Promise<User> => {
  return prisma.user.update({
    where: { email },
    data,
  });
};

export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getUserWithPreferences = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

// export const updateUserPreferences = async (
//   userId: string, 
//   preferredTypes: PropertyType[]
// ) => {
//   // First delete existing preferences
//   await prisma.propertyTypePreference.deleteMany({
//     where: { userId },
//   });
  
//   // Then create new ones
//   const preferences = preferredTypes.map(type => ({
//     userId,
//     propertyType: type,
//   }));
  
//   return prisma.propertyTypePreference.createMany({
//     data: preferences,
//   });
// };