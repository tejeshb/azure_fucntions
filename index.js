const nodemailer = require('nodemailer');
const Chart = require('chart.js');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');




module.exports = async function (context, req) {
    const { email,messageData, recepname, tableData } = req.body;
    console.log("hello",req)

    if (tableData) {
        const chartData = {
          labels: Object.keys(tableData),
          datasets: [
            {
              label: 'Sales',
              data: Object.values(tableData),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };

        const chartOptions = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            animation: {
              duration: 2000,
            },
          };
      
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
      
          const chart = new Chart(page, {
            type: 'bar',
            data: chartData,
            options: chartOptions,
          });
      
          const chartImage = await chart.toBase64Image();
      
          await browser.close();
        }
    else {
    context.res = {
        status: 400,
        body: 'Please provide sales data in the request body.',
    };
    };

  
    // create nodemailer transporter with your email provider details
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'teja.tejeshteja@gmail.com',
        pass: 'yemcewfstffruxpz'
      }
    });
  
    // render email template with ejs
    const path = require('path');
    const html = await ejs.renderFile(path.join(__dirname, 'views/report.ejs'), { recepname,messageData, chartImage });
    // const html = await ejs.renderFile(path.join(__dirname, 'views/reports.ejs'), { recepname,messageData, tableData });
    // const html = await ejs.renderFile('emailTemplate.ejs', { messageData });

    console.log("email:",email)
  
    // send email with nodemailer
    const info = await transporter.sendMail({
      from: 'teja.tejeshteja@gmail.com',
      to: email,
      subject: 'Redefine Reports',
      html: html
    });
  
    context.res = {
      body: 'Email sent not  successfully'
    };
  };
  