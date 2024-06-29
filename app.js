const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/claim-deal', async (req, res) => {
    const { name, email, contact_no, barcode_id } = req.body;

    try {
        await knex('customers').insert({ name, email, contact_no, barcode_id });

        const msg = {
            to: email,
            from: 'test@example.com', // Replace with your verified sender
            subject: 'Deal Claimed Successfully',
            text: 'Thank you for claiming your deal!',
            html: '<strong>Thank you for claiming your deal!</strong>',
            mail_settings: {
                sandbox_mode: {
                    enable: true
                }
            }
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'Deal claimed successfully!' });
    } catch (error) {
        console.error('SendGrid Error:', error.response.body.errors);
        res.status(500).json({ message: 'Error claiming deal. Please try again later.' });
    }
});

app.post('/send-promotions', async (req, res) => {
    try {
        const customers = await knex.select('email').from('customers');
        const emails = customers.map(customer => customer.email);

        const msg = {
            to: emails,
            from: 'test@example.com', // Replace with your verified sender
            subject: 'Special Promotion',
            text: 'We have an exciting promotion for you!',
            html: '<strong>We have an exciting promotion for you!</strong>',
            mail_settings: {
                sandbox_mode: {
                    enable: true
                }
            }
        };

        await sgMail.sendMultiple(msg);

        res.status(200).json({ message: 'Promotional emails sent successfully!' });
    } catch (error) {
        console.error('SendGrid Error:', error.response.body.errors);
        res.status(500).json({ message: 'Error sending promotional emails. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
