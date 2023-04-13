import express from "express";
import connection from "../database.js"
import moment from "moment";
import bcrypt from 'bcryptjs';


// Encryption of the string password


const authRoutes = express.Router()
authRoutes.route('/register')
    .post((req, res) => {
        let date = moment();
        let dateStr = date.format("DD-MM-YY HH:mm");
        var password = req.body.password;
        bcrypt.genSalt(10, function (err, Salt) {
            bcrypt.hash(password, Salt, function (err, hash) {

                if (err) {
                    return console.log('Cannot encrypt');
                }
                password = hash;
                var sql = `insert into users (type,name,email,password,created_at) values ("${req.body.type}","${req.body.name}","${req.body.email}","${password}","${dateStr}")`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        if (err.errno == 1062) {
                            res.send({
                                message: 'email already registered'
                            })
                        }
                        else {
                            res.send({
                                message: err.sqlMessage
                            })
                        }
                        throw err;
                    };
                    res.send({
                        message: "user Logged in",
                        user_id: result.insertId
                    })
                });
            })

        })

    });
authRoutes.route('/login')
    .post((req, res) => {
        var password = req.body.password;
        var email = req.body.email;
        connection.query(`SELECT * FROM users where email = "${email}" AND type = "${req.body.type}" `, function (err, result, fields) {
            if (err) {
                res.status(400).send({
                    message: 'Error Logging in'
                })
                throw err;
            }
            else {
                if (result.length == 0) {
                    res.status(400).send({
                        message: 'Email Not Registered'
                    })
                    return
                }
                bcrypt.compare(password, result[0].password,
                    async function (err, isMatch) {
                        if (isMatch) {
                            res.status(200).send({
                                message: 'Logged in',
                                user_id: result[0].id
                            })
                        }
                        if (!isMatch) {
                            res.status(400).send({
                                message: 'Password does not matched!'
                            })
                        }
                    })
            }
        })

    });
authRoutes.route('/usertype/:id').get((req, res) => {
    var sql = `select * from users where id = ${req.params.id}`
    connection.query(sql, (err, result, fields) => {
        if (err) {
            res.status(400).send({
                message: 'error getting user'
            })
            throw err;
        }
        res.status(200).send({
            message: 'user found',
            type: result[0].type
        })
    })
})



export default authRoutes;