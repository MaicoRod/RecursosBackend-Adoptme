import { faker }  from '@faker-js/faker';
import { createHash } from './index.js';

export const generateMockUsers = async (num) => {
    const users = [];

    const hashedPassword = await createHash('coder123');

    for (let i = 0; i < num; i++) {
        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: []
        };
        users.push(user);
    }
    return users;
};