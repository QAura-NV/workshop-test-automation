/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // Add superuser
    let superusers = app.findCollectionByNameOrId("_superusers");
    let record = new Record(superusers, {
      email: $os.getenv("POCKETBASE_ADMIN_EMAIL") || "test@example.com",
      password: $os.getenv("POCKETBASE_ADMIN_PASSWORD") || "test",
    });
    app.save(record);

    // Add categories
    let categoryIds = {};
    let categories = app.findCollectionByNameOrId("categories");
    for (let name of CATEGORIES) {
      let record = new Record(categories, {
        name: name,
      });
      app.save(record);
      categoryIds[name] = record.id;
    }

    // Add Dogs
    let pets = app.findCollectionByNameOrId("pets");
    for (let dogName of DOG_NAMES) {
      let record = new Record(pets, {
        name: dogName,
        category: categoryIds["Dog"],
        status: "available",
      });
      app.save(record);
    }

    // Add Cats
    for (let catName of CAT_NAMES) {
      let record = new Record(pets, {
        name: catName,
        category: categoryIds["Cat"],
        status: "available",
      });
      app.save(record);
    }
  },
  (app) => {
    // Remove cats
    let pets = app.findCollectionByNameOrId("pets");
    let catRecords = app.findRecordsByFilter(
      pets,
      CAT_NAMES.map((name) => `name = "${name}"`).join("||")
    );
    for (let record of catRecords) {
      app.delete(record);
    }

    // Remove dogs
    let dogRecords = app.findRecordsByFilter(
      pets,
      DOG_NAMES.map((name) => `name = "${name}"`).join("||")
    );
    for (let record of dogRecords) {
      app.delete(record);
    }

    // Remove categories
    let categories = app.findCollectionByNameOrId("categories");
    let categoryRecords = app.findRecordsByFilter(
      categories,
      CATEGORIES.map((name) => `name = "${name}"`).join("||")
    );
    for (let record of categoryRecords) {
      app.delete(record);
    }

    // Remove superuser
    let record = app.findAuthRecordByEmail(
      "_superusers",
      $os.getenv("POCKETBASE_ADMIN_EMAIL") || "test@example.com"
    );
    app.delete(record);
  }
);

const CATEGORIES = [
  "Cat",
  "Dog",
  "Bird",
  "Fish",
  "Reptile",
  "Small Mammal",
  "Farm Animal",
];

const DOG_NAMES = [
  "Apollo",
  "Bandit",
  "Bear",
  "Bentley",
  "Buster",
  "Buddy",
  "Charlie",
  "Cody",
  "Cooper",
  "Diesel",
  "Duke",
  "Finn",
  "Gunner",
  "Gus",
  "Hunter",
  "Jake",
  "Leo",
  "Max",
  "Milo",
  "Murphy",
  "Oliver",
  "Oscar",
  "Rex",
  "Riley",
  "Rocky",
  "Samson",
  "Thor",
  "Tucker",
  "Winston",
  "Zeus",
  "Ziggy",
  "Ace",
  "Archie",
  "Bailey",
  "Beau",
  "Blue",
  "Bruno",
  "Cash",
  "Chase",
  "Dexter",
  "Frankie",
  "George",
  "Hank",
  "Jackson",
  "Jasper",
  "Joey",
  "Louie",
  "Lucky",
  "Moose",
  "Ollie",
];

const CAT_NAMES = [
  "Angel",
  "Bella",
  "Boots",
  "Callie",
  "Chloe",
  "Cleo",
  "Coco",
  "Daisy",
  "Felix",
  "Finn",
  "Ginger",
  "Gracie",
  "Jack",
  "Jasper",
  "Kitty",
  "Leo",
  "Lily",
  "Loki",
  "Luna",
  "Maggie",
  "Max",
  "Mia",
  "Milo",
  "Mimi",
  "Missy",
  "Misty",
  "Mittens",
  "Mochi",
  "Nala",
  "Oliver",
  "Oreo",
  "Oscar",
  "Peanut",
  "Pumpkin",
  "Rosie",
  "Ruby",
  "Sadie",
  "Salem",
  "Sammy",
  "Shadow",
  "Simba",
  "Smokey",
  "Socks",
  "Sophie",
  "Stella",
  "Tiger",
  "Toby",
  "Willow",
  "Ziggy",
  "Zoe",
];
