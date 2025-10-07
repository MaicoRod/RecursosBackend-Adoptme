import { faker } from '@faker-js/faker';

export const generateMockPets = (num) => {
    const pets = [];
    const species = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Turtle', 'Fish'];

    for (let i = 0; i < num; i++) {
        const pet = {
            name: faker.animal.petName(),
            specie: faker.helpers.arrayElement(species),
            birthDate: faker.date.past({years: 10}),
            adopted: false,
            image: faker.image.urlLoremFlickr({category: 'animals'})
        };
        pets.push(pet);
    }

    return pets;
};