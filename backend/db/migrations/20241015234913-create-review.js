// migration reviews
'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Spots",
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      review: {
        allowNull: false,
        type: Sequelize.STRING
      },
      stars: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE
      }
    }, options, {});
    if (process.env.NODE_ENV === "production") {
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE ${options.schema ? `"${options.schema}"."Reviews"` : "Reviews"} RESTART IDENTITY CASCADE;`
      );
    } else if (process.env.NODE_ENV === "development") {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "Reviews_id_seq" RESTART WITH 1;`
      );
    }
  },
  async down(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "production") {
      await queryInterface.sequelize.query(
        `TRUNCATE TABLE ${options.schema ? `"${options.schema}"."Reviews"` : "Reviews"} RESTART IDENTITY CASCADE;`
      );
    } else if (process.env.NODE_ENV === "development") {
      await queryInterface.sequelize.query(
        `ALTER SEQUENCE "Reviews_id_seq" RESTART WITH 1;`
      );
    }
    await queryInterface.dropTable("Reviews", options);
  }
};