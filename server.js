const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
    swaggerDefinition: {
        info: {
            title: 'API For Swagger Test',
            version: '1.0.0',
            description: 'API by Pranjal for ITIS 6177 to test Swagger'
        },
        host: 'localhost:3000',
        baseurl: '/'
    },
    apis: ['./server.js'],
};
const specs = swaggerJsdoc(options);
const {
    param,
    body,
    validationResult
} = require('express-validator');
const axios = require('axios');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(express.json());

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});

// Swagger Definitions
/**
 * @swagger
 *
 * definitions:
 *   Agent:
 *     type: object
 *     required:
 *       - AGENT_CODE
 *     properties:
 *       AGENT_CODE:
 *         type: string
 *       AGENT_NAME:
 *         type: string
 *       WORKING_AREA:
 *         type: string
 *       COMMISSION:
 *         type: number
 *         format: float
 *       PHONE_NO:
 *         type: string
 *       COUNTRY:
 *         type: string
 *   Company:
 *     type: object
 *     required:
 *       - COMPANY_ID
 *     properties:
 *       COMPANY_ID:
 *         type: string
 *       COMPANY_NAME:
 *         type: string
 *       COMPANY_CITY:
 *         type: string
 *   Customer:
 *     type: object
 *     required:
 *       - CUST_CODE
 *       - CUST_NAME
 *     properties:
 *       CUST_CODE:
 *         type: string
 *       CUST_NAME:
 *         type: string
 *       CUST_CITY:
 *         type: string
 *       WORKING_AREA:
 *         type: string
 *       CUST_COUNTRY:
 *         type: string
 *       GRADE:
 *         type: number
 *         format: float
 *       OPENING_AMT:
 *         type: number
 *         format: float
 *       RECEIVE_AMT:
 *         type: number
 *         format: float
 *       PAYMENT_AMT:
 *         type: number
 *         format: float
 *       OUTSTANDING_AMT:
 *         type: number
 *         format: float
 *       PHONE_NO:
 *         type: string
 *       AGENT_CODE:
 *         type: string
 *   Student:
 *     type: object
 *     required:
 *       - NAME
 *       - TITLE
 *       - CLASS
 *       - SECTION
 *       - ROLLID
 *     properties:
 *       NAME:
 *         type: string
 *       TITLE:
 *         type: string
 *       CLASS:
 *         type: string
 *       SECTION:
 *         type: string
 *       ROLLID:
 *         type: number
 *         format: float
 *   CompanyPutRequest:
 *     type: object
 *     required:
 *       - COMPANY_NAME
 *       - COMPANY_CITY
 *     properties:
 *       COMPANY_NAME:
 *         type: string
 *       COMPANY_CITY:
 *         type: string
 *   CompanyPatchRequest:
 *     type: object
 *     required:
 *       - COMPANY_NAME
 *     properties:
 *       COMPANY_NAME:
 *         type: string
 *   SayMessage:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 */

/**
 * @swagger
 * /agents:
 *   get:
 *     description: Returns all agents
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Agent'
 *       500:
 *         description: "Error"
 */
app.get('/agents', async function(req, res) {
    res.header('Content-Type', 'application/json');
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM agents");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    } finally {
        if (conn) return conn.end();
    }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     description: Returns all companies
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Company'
 *       500:
 *         description: "Error"
 */
app.get('/companies', async function(req, res) {
    res.header('Content-Type', 'application/json');
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM company");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    } finally {
        if (conn) return conn.end();
    }
});

/**
 * @swagger
 * /company:
 *   post:
 *     description: Create a company
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: company
 *         description: Company to be created
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Company'
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *       400:
 *         description: "Bad Request"
 *       500:
 *         description: "Error"
 */
app.post('/company', [
    // Validate and Sanitize input
    body('COMPANY_ID').not().isEmpty().trim().escape(),
    body('COMPANY_NAME').not().isEmpty().trim().escape(),
    body('COMPANY_CITY').not().isEmpty().trim().escape()
], async function(req, res) {
    res.header('Content-Type', 'application/json');
    // Validate and Sanitize input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            let req_body = req.body;
            await conn.query("INSERT INTO company VALUES (?, ?, ?)", [req_body.COMPANY_ID, req_body.COMPANY_NAME, req_body.COMPANY_CITY]);
            res.status(200).end();
        } catch (err) {
            console.log(err);
            res.status(400).json({
                'error': err
            });
        } finally {
            if (conn) return conn.end();
        }
    }
});

/**
 * @swagger
 * /company/{COMPANY_ID}:
 *   patch:
 *     description: Update company name
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: COMPANY_ID
 *         description: Id of company getting updated
 *         in:  path
 *         required: true
 *         type: string
 *       - name: companyName
 *         description: Company to be updated
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CompanyPatchRequest'
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *       400:
 *         description: "Bad Request"
 *       500:
 *         description: "Error"
 */
app.patch('/company/:COMPANY_ID', [
    // Validate and Sanitize input
    param('COMPANY_ID').not().isEmpty().trim().escape(),
    body('COMPANY_NAME').not().isEmpty().trim().escape(),
], async function(req, res) {
    res.header('Content-Type', 'application/json');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            let req_body = req.body;
            const rows = await conn.query("UPDATE company SET COMPANY_NAME=? WHERE COMPANY_ID=?", [req_body.COMPANY_NAME, req.params.COMPANY_ID]);
            if (rows.affectedRows == 0) {
                res.status(400).json({
                    'error': 'Invalid company Id supplied'
                });
            } else {
                res.status(200).end();
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                'error': err
            });
        } finally {
            if (conn) return conn.end();
        }
    }
});

/**
 * @swagger
 * /company/{COMPANY_ID}:
 *   put:
 *     description: Update the entire company object
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: COMPANY_ID
 *         description: Id of company getting updated
 *         in:  path
 *         required: true
 *         type: string
 *       - name: company
 *         description: Company to be updated
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CompanyPutRequest'
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *       400:
 *         description: "Bad Request"
 *       500:
 *         description: "Error"
 */
app.put('/company/:COMPANY_ID', [
    // Validate and Sanitize input
    param('COMPANY_ID').not().isEmpty().trim().escape(),
    body('COMPANY_NAME').not().isEmpty().trim().escape(),
    body('COMPANY_CITY').not().isEmpty().trim().escape()
], async function(req, res) {
    res.header('Content-Type', 'application/json');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            let req_body = req.body;
            const rows = await conn.query("UPDATE company SET COMPANY_NAME=?, COMPANY_CITY=? WHERE COMPANY_ID=?",
                [req_body.COMPANY_NAME, req_body.COMPANY_CITY, req.params.COMPANY_ID]);
            if (rows.affectedRows == 0) {
                res.status(400).json({
                    'error': 'Invalid company Id supplied'
                });
            } else {
                res.status(200).end();
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                'error': err
            });
        } finally {
            if (conn) return conn.end();
        }
    }
});

/**
 * @swagger
 * /company/{COMPANY_ID}:
 *   delete:
 *     description: Delete a company
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: COMPANY_ID
 *         description: Id of company getting deleted
 *         in:  path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *       400:
 *         description: "Bad Request"
 *       500:
 *         description: "Error"
 */
app.delete('/company/:COMPANY_ID', [
    // Validate and Sanitize input
    param('COMPANY_ID').not().isEmpty().trim().escape()
], async function(req, res) {
    res.header('Content-Type', 'application/json');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } else {
        let conn;
        try {
            conn = await pool.getConnection();
            let req_body = req.body;
            const rows = await conn.query("DELETE FROM company WHERE COMPANY_ID=?", [req.params.COMPANY_ID]);
            if (rows.affectedRows == 0) {
                res.status(400).json({
                    'error': 'Invalid company Id supplied'
                });
            } else {
                res.status(200).end();
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                'error': err
            });
        } finally {
            if (conn) return conn.end();
        }
    }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     description: Returns all customers
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Customer'
 *       500:
 *         description: "Error"
 */
app.get('/customers', async function(req, res) {
    res.header('Content-Type', 'application/json');
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM customer");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    } finally {
        if (conn) return conn.end();
    }
});

/**
 * @swagger
 * /students:
 *   get:
 *     description: Returns all students
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *         schema:
 *           type: array
 *           $ref: '#/definitions/Student'
 *       500:
 *         description: "Error"
 */
app.get('/students', async function(req, res) {
    res.header('Content-Type', 'application/json');
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM student");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err
        });
    } finally {
        if (conn) return conn.end();
    }
});

/**
 * @swagger
 * /say:
 *   get:
 *     description: Returns response from AWS Lambda function
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: keyword
 *         description: What you want AWS Lambda function to say?
 *         in:  query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Successful Operation"
 *         schema:
 *           $ref: '#/definitions/SayMessage'
 *       500:
 *         description: "Error"
 */
app.get('/say', async function(req, res) {
	res.header('Content-Type', 'application/json');
	let lambda_url = "https://djzuh8moki.execute-api.us-east-2.amazonaws.com/default/my-function?keyword=" + req.query.keyword;
	//lambda_url = "https://djzuh8moki.execute-api.us-east-2.amazonaws.com/default/my-function";
    // Make a request to AWS Lambda function
    axios.get(lambda_url)
        .then(function(lambda_res) {
            // handle success
			res_message = lambda_res.data;
            console.log("AWS Lambda Function Response:" + res_message);
			res.json({
				"message": res_message
			});
        })
        .catch(function(err) {
			// handle error
            console.log(err);
            res.status(500).send(err);
        })
        .then(function() {
            // always executed
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
