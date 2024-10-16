"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
        },
        {
          ownerId: 49,
          address: "2100 Black diamond",
          city: "Colorado Springs",
          state: "Colorado",
          country: "United States of America",
          lat: 34.7649654,
          lng: -123.4530325,
          name: "Awesome spot",
          description: "Place where JA developed",
          price: 777,
        },
        {
          ownerId: 49,
          address: "2100 White diamond",
          city: "Cloud Springs",
          state: "Colorado",
          country: "United States of America",
          lat: 34.7649654,
          lng: -123.4570325,
          name: "Great spot",
          description: "Place where Freddy developed",
          price: 177,
        },
        {
          ownerId: 9,
          address: "2720 Black Cloud",
          city: "Denver",
          state: "Colorado",
          country: "United States of America",
          lat: 35.7647654,
          lng: -133.4545325,
          name: "Amazing spot",
          description: "Place where developed amazing people",
          price: 333,
        },
        {
          ownerId: 11,
          address: "2345 Strange street",
          city: "Pueblo",
          state: "Colorado",
          country: "United States of America",
          lat: 34.76496567,
          lng: -123.45304567,
          name: "Strange spot",
          description: "Place where developed strange people",
          price: 200,
        },
        {
          ownerId: 12,
          address: "2340 Captains Drive",
          city: "Arlington",
          state: "Texas",
          country: "United States of America",
          lat: 35.76496567,
          lng: -126.45304567,
          name: "Caps House",
          description: "The best spot to be!",
          price: 350,
        },
        {
          ownerId: 13,
          address: "556 Widow Ln",
          city: "Webb",
          state: "New Hampshire",
          country: "United States of America",
          lat: 38.76496567,
          lng: -122.45304567,
          name: "The Web",
          description: "It's dark and gloomy, AWESOME.",
          price: 450,
        },
        {
          ownerId: 11,
          address: "223 Speedway Ln",
          city: "Central City",
          state: "Texas",
          country: "United States of America",
          lat: 34.76496123,
          lng: -123.45305567,
          name: "The SpeedForce",
          description: "Unknown",
          price: 1000,
        },
        {
          ownerId: 11,
          address: "2100 Dragon Dr",
          city: "Dragon City",
          state: "Colorado",
          country: "United States of America",
          lat: 36.74496567,
          lng: -123.45302267,
          name: "Bearded Palace",
          description: "No relation to bearded lady",
          price: 175,
        },
        {
          ownerId: 11,
          address: "1234 Moose Cr",
          city: "Anna",
          state: "Texas",
          country: "United States of America",
          lat: 34.76483726,
          lng: -123.4538625,
          name: "The Moose Castle",
          description: "Where the MOOse gets loose",
          price: 1500,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "App Academy",
            "Awesome spot",
            "Great spot",
            "Amazing spot",
            "Strange spot",
            "Caps House",
            "The Web",
            "The SpeedForce",
            "Bearded Palace",
            "The Moose Castle",
          ],
        },
      },
      {}
    );
  },
};
