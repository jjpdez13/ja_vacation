## TO CREATE TABLES

# Table : Spots

```bash
npx sequelize model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:decimal,lng:decimal,name:string,description:string,price:decimal
```

After generation, change file, especially for updating createdAt and updatedAt to include

```JS
defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
```

AND associations (in models):

```JS
Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'});
Spot.hasMany(models.Booking, { foreignKey: 'spotId'});
Spot.hasMany(models.Review, { foreignKey: 'spotId'});
```
```JS
User.hasMany(models.Spot, { foreignKey: 'ownerId'});
User.hasMany(models.Booking, { foreignKey: 'userId'});
User.hasMany(models.Review, {foreignKey: 'userId'});
```
Comment out any associated tables that have yet to be created.

Then migrate:

```bash
npx dotenv sequelize db:migrate
```

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Spots"
```

# Seed Spots

Generate the seed file:

```bash
npx sequelize seed:generate --name demo-spots
```

make any changes necessary (i.e. create up to 10 spots);

```bash
npx dotenv sequelize db:seed:all
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "Spots"'
```

# For changing files or if any errors

IF we have any other changes we must undo migrate and undo seed:

1. in bash undo seed first

```bash
npx dotenv sequelize db:seed:undo:all
```

AND then undo migrate

```bash
npx dotenv sequelize db:migrate:undo:all
```

2. Make the changes or corrections

3. redo migrate first

```bash
npx dotenv sequelize db:migrate
```

AND redo seed

```bash
npx dotenv sequelize db:seed:all
```

# Then check schema and tables

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Spots"
```

check if the table exists: s

```bash
sqlite3 db/dev.db 'SELECT * FROM "Spots"'
```

# Table : SpotImages

```bash
npx sequelize model:generate --name SpotImage --attributes spotId:integer,url:string,preview:boolean
```

After generation, change file, especially for updating createdAt and updatedAt to include

```JS
defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
```

in preview, boolean is default value to be false,
AND associations (in models):

```JS
SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
```

Then migrate:

```bash
npx dotenv sequelize db:migrate
```

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema SpotImages"
```

# Seed SpotImages

Generate the seed file:

```bash
npx sequelize seed:generate --name demo-SpotImages
```

make any changes necessary

```bash
npx dotenv sequelize db:seed:all
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "SpotImages"'
```

# For changing files or if any errors

IF we have any other changes we must undo migrate and undo seed:

1. in bash undo seed first

```bash
npx dotenv sequelize db:seed:undo:all
```

AND then undo migrate

```bash
npx dotenv sequelize db:migrate:undo:all
```

2. Make the changes or corrections

3. redo migrate first

```bash
npx dotenv sequelize db:migrate
```

AND redo seed

```bash
npx dotenv sequelize db:seed:all
```

# Then check schema and tables

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema SpotImages"
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "SpotImages"'
```

# Table : Bookings

```bash
npx sequelize model:generate --name Booking --attributes spotId:integer,userId:integer,startDate:date,endDate:date
```

After generation, change file, especially for updating createdAt and updatedAt to include

```JS
defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
```

AND associations (in models):

```JS
Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
Booking.belongsTo(models.User, { foreignKey: 'userId'});
```

Then migrate:

```bash
npx dotenv sequelize db:migrate
```

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Bookings"
```

# Seed Bookings

Generate the seed file:

```bash
npx sequelize seed:generate --name demo-Bookings
```

make any changes necessary

```bash
npx dotenv sequelize db:seed:all
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "Bookings"'
```

# For changing files or if any errors

IF we have any other changes we must undo migrate and undo seed:

1. in bash undo seed first

```bash
npx dotenv sequelize db:seed:undo:all
```

AND then undo migrate

```bash
npx dotenv sequelize db:migrate:undo:all
```

2. Make the changes or corrections

3. redo migrate first

```bash
npx dotenv sequelize db:migrate
```

AND redo seed

```bash
npx dotenv sequelize db:seed:all
```

# Then check schema and tables

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Bookings"
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "Bookings"'
```

# Table : Reviews

```bash
npx sequelize model:generate --name Review --attributes spotId:integer,userId:integer,review:string,stars:integer
```

After generation, change file, especially for updating createdAt and updatedAt to include

```JS
defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
```

AND associations (in models):

```JS
Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
Review.belongsTo(models.User, { foreignKey: 'userId'});
Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId'});
```

Then migrate:

```bash
npx dotenv sequelize db:migrate
```

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Reviews"
```

# Seed Reviews

Generate the seed file:

```bash
npx sequelize seed:generate --name demo-Reviews
```

make any changes necessary (i.e. create up to 5 reviews EACH spot);

```bash
npx dotenv sequelize db:seed:all
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "Reviews"'
```

# For changing files or if any errors

IF we have any other changes we must undo migrate and undo seed:

1. in bash undo seed first

```bash
npx dotenv sequelize db:seed:undo:all
```

AND then undo migrate

```bash
npx dotenv sequelize db:migrate:undo:all
```

2. Make the changes or corrections

3. redo migrate first

```bash
npx dotenv sequelize db:migrate
```

AND redo seed

```bash
npx dotenv sequelize db:seed:all
```

# Then check schema and tables

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema Reviews"
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "Reviews"'
```
# Table : ReviewImages

```bash
npx sequelize model:generate --name ReviewImage --attributes reviewId:integer,url:string
```

After generation, change file, especially for updating createdAt and updatedAt to include

```JS
defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
```

AND associations (in models):

```JS
ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
```

Then migrate:

```bash
npx dotenv sequelize db:migrate
```

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema ReviewImages"
```

# Seed ReviewImages

Generate the seed file:

```bash
npx sequelize seed:generate --name demo-ReviewImages
```

make any changes necessary

```bash
npx dotenv sequelize db:seed:all
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "ReviewImages"'
```

# For changing files or if any errors

IF we have any other changes we must undo migrate and undo seed:

1. in bash undo seed first

```bash
npx dotenv sequelize db:seed:undo:all
```

AND then undo migrate

```bash
npx dotenv sequelize db:migrate:undo:all
```

2. Make the changes or corrections

3. redo migrate first

```bash
npx dotenv sequelize db:migrate
```

AND redo seed

```bash
npx dotenv sequelize db:seed:all
```

# Then check schema and tables

check if the schema exists:

```bash
sqlite3 db/dev.db ".schema ReviewImages"
```

check if the table exists:

```bash
sqlite3 db/dev.db 'SELECT * FROM "ReviewImages"'
```
