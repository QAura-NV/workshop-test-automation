/// <reference path="../pb_data/types.d.ts" />

onRecordCreate((e) => {
  $app.findRecordsByIds("pets", e.record.get("pets")).forEach((pet) => {
    pet.set("status", "pending");
    $app.save(pet);
  });

  e.next();
}, "orders");

onRecordUpdate((e) => {
  if (e.record.getString("status") === "approved") {
    $app.findRecordsByIds("pets", e.record.get("pets")).forEach((pet) => {
      pet.set("status", "sold");
      $app.save(pet);
    });
  }

  e.next();
}, "orders");
