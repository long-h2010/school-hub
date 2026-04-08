import { faker } from '@faker-js/faker';

const roles = ['user', 'admin'];
const genders = ['male', 'female'];
const statuses = ['active', 'banned', 'restricted'];

export const generateUsers = (count = 1000) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 365 });

    const status = faker.helpers.arrayElement(statuses);

    users.push({
      username: faker.internet.username().toLowerCase() + i,
      password: '$2b$10$fakehashedpassword',
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      avatar: '/default-avatar.png',
      coverPhoto: faker.datatype.boolean()
        ? faker.image.urlPicsumPhotos()
        : null,
      gender: faker.helpers.arrayElement(genders),
      birthday: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }),
      bio: faker.lorem.sentence(),
      role: faker.helpers.arrayElement(roles),
      status,
      statusExpiry: status === 'blocked' ? faker.date.future() : null,
      otp: faker.datatype.boolean() ? '123456' : null,
      otpExpiry: faker.datatype.boolean() ? faker.date.soon() : null,
      isDeleted: faker.datatype.boolean({ probability: 0.1 }),
      createdAt,
      updatedAt: createdAt,
    });
  }

  return users;
};
