
import connection from "../database.js"
import express from "express";
import moment from "moment";
const carRoutes = express.Router()
carRoutes.route('/:id')
    .post((req, res) => {
        try {
            var id = req.params.id;
            var dateStr = moment().format("DD-MM-YY HH:MM");
            var sql = `insert into car_details (model,number,capacity,rent,booked,created_at,created_by) values ("${req.body.model}","${req.body.number}","${req.body.capacity}","${req.body.rent}","${req.body.booked}","${dateStr}","${id}")`;
            connection.query(sql, function (err, result) {
                if (err) {
                    res.status(400).send({
                        message: err.sqlMessage
                    })
                    throw err;
                };
                res.status(200).send({
                    message: "car Added",
                    result: result.affectedRows
                })
            })

        } catch (error) {
            console.log(error);
        }

    })

carRoutes.route('/:id')
    .put((req, res) => {
        try {
            var sql = `UPDATE  car_details SET model = "${req.body.model}", number = "${req.body.number}", capacity = "${req.body.capacity}", rent = "${req.body.rent}",booked = ${req.body.booked} where number = "${req.body.number}"`;
            connection.query(sql, function (err, result) {
                if (err) {
                    res.send({
                        message: err.sqlMessage
                    })
                    throw err;
                };
                res.status(200).send({
                    message: "car Info Edited",
                    result: result.affectedRows
                })
            })

        } catch (error) {
            console.log(error);
        }

    })

carRoutes.route('/agency/:id')
    .get((req, res) => {
        try {
            var id = req.params.id;
            connection.query(`SELECT * FROM car_details where created_by = ${id}`, function (err, result, fields) {
                if (err) {
                    res.send({
                        message: err.sqlMessage
                    })
                    throw err;
                };
                res.status(200).send({
                    message: "Successfully got cars",
                    cars: result
                })
            })
        } catch (error) {
            console.log(error);
        }
    })
carRoutes.route('/availableCars')
    .get((req, res) => {
        try {
            connection.query(`SELECT * FROM car_details`, function (err, result, fields) {
                if (err) {
                    res.send({
                        message: err.sqlMessage
                    })
                    throw err;
                };
                res.status(200).send({
                    message: "Successfully got cars",
                    cars: result
                })
            })

        } catch (error) {
            console.log(error);
        }

    })
carRoutes.route('/book/:id')
    .post((req, res) => {
        var dateStr = moment().format("DD-MM-YY HH:MM");
        try {
            var sql = `insert into booked_cars (car_id,days_booked,start_date,booked_by) values ("${req.params.id}","${req.body.days_booked}","${dateStr}","${req.body.booked_by}")`;
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    res.send({
                        message: err.sqlMessage
                    })
                    throw err;
                }
                res.status(200).send({
                    message: "Car Booked",
                    cars: result
                })
            })
        } catch (error) {
            console.log(error);

        }
    })
carRoutes.route('/customers/:id')
    .get((req, res) => {
        var id = req.params.id
        let sql = `SELECT
                    users.name,
                    users.email,
                    booked_cars.booked_by,
                    booked_cars.days_booked,
                    booked_cars.start_date,
                    car_details.model,
                    car_details.id,
                    car_details.rent,
                    car_details.created_by

                FROM booked_cars
                JOIN users
                    ON booked_cars.booked_by = users.id
                JOIN car_details
                    ON booked_cars.car_id = car_details.id where car_details.created_by = ${id} `
        try {
            connection.query(sql, function (err, result, fields) {
                if (err) {
                    res.send({
                        message: err.sqlMessage
                    })
                    throw err;
                };
                res.status(200).send({
                    message: "Successfully got customers",
                    cars: result
                })
            })
        } catch (error) {
            console.log(error);
        }

    })

export default carRoutes;