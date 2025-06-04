/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date1576173484",
    "max": "",
    "min": "",
    "name": "delivered",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date1576173484",
    "max": "",
    "min": "",
    "name": "shipped",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
