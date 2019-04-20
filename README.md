# Dollaroo

## Overview

![Dollaroo](./images/DollarRooBanner.png)

Dollaroo is a cloud-based web and mobile application that imitates smart safe functionality with minimal upfront cost.

## Team

* [x] Noah Anderson
* [x] Paul Linck
* [x] JJ Harry

### The Problem

Almost 30% of all retail transactions are by cash. In the US and Canada, $96b was spent on cash handling activites in 2017.  Average cost of cash across all retailers is 9.1%  Banks are increasingly abandoning solutions for cash-heavy clients in favor of serving customers digitally. As the payment mix changes, outdated products and processes have not been improved upon - leaving a gap in service.  Data gathered from a 2018 IHL Group Cost of Cash Study

“The primary issue is that the number of lanes that accept cash has increased….but the percentage of cash transactions has dropped. What is left is a process….that has become even more inefficient as the payment mix has changed.”
 -IHL Group

* Average Cost of Cash for Bars/Restaurants is: 15.5%, For Fast Food its 11.4%

### The Existing Process

Cash is collected from customers and stored in the drawer
Managers “Close” the drawer at the end of each shift
Manually sort and count bills
Reconcile with sales totals by hand (may require a re-count if discrepancies exist)
Manually input cash totals to POS software
Managers “Rebuild” drawer to starting cash amount for new shift
At the end of the dat, the manager will typically drive/walk the cash to a bank branch prior to the deposit cutoff time
Cash is held in locked canvas bag along with a deposit slip
Typically, locations will have a deposit relationship with whatever bank is closest.
The company’s account department must manually consolidate funds into a company deposit account.

![Dollaroo](./images/oldProcess.png)

### Our Solution

A cloud-based web and mobile application that imitates smart safe functionality with minimal upfront cost.
Instant deposits of provisional credit via Realtime Payment Network.
Smart bill counter to facilitate register closing.
Scalable Solution supports multiple locations.
“Cash Recycle” function to rebuild registers without ordering more bills.
Store case in existing safe and deposit less frequently through method of choice.
Cloud Based Analytics portal with a comprehensive deposit information and export functionality

![Dollaroo](./images/newProcess.png)

### Deposit Process

![Dollaroo](./images/Deposit.png)

### Deployment

This is deployed to **Google Cloud Platform**.  GCP provides several huge advantages especially as it relates to security and hiding keys and credentials.  When app is running in test mode, sensitive data is stored in hidden files on developers local machine. When depoloyed to google cloud platform, the services keys, credentials etc are automatically protected and accessed inside the google cloud platform App engine.

## Links

* [Live Google Cloud Platform Site](https://project3-noahpauljj-fintech2.appspot.com)
* [GitHub for this](https://github.com/nanderson815/Project3/)
* [Paul Portfolio](https://paullinck.com/)
* [Noah Portfolio]
* [JJ Portfolio]

## Technologies Used

* [x] HTML/CSS/Javascript
* [x] REACT
* [x] Node.js, Express
* [x] Firebase Auth with Custom Claims
* [x] Firebase Firestore for all secured data
* [x] MongoDB and Mongose (for Schemas, non-secure data)
* [x] MongoDB Atlas Clusters
* [x] Axios (in node server and REACT components)
* [x] Materialize, MaterialUI
* [x] Google Cloud Platform
* [x] Plotly (for Graphing)

## Screenshots

![ss1 animated](client/public/images/ss1.gif)

![ss2](client/public/images/ss2.png)

![ss3](client/public/images/ss3.png)

![ss4](client/public/images/ss4.png)

## Details

  1. Whenever a user visits, the app scrapes stories from a news outlet displays artilces for the user.  If there is an image with teh article, it displays it, otherwise, I provide a generic news image.  
     * Each scraped article is saved to Mongo only when the user clicks the heart icon (save).  I chose not to save all articles since there is no reason to save articles the user does not care about. The app scrapes and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article
  
     * ImageUrl - if it exists

  2. Users can leave comments on the articles they saved to revisit them later.

  3. Users can delete saved articles and comments left on articles. All stored comments should be visible to every user.

## Architecture

### Model View Controller (with lightweight controller routing to business and data logic)

* Views / `/client` - `/public` (dev) and `/build` (productoion) HTML/CSS/JS using REACT
  * Materialize JS and CSS
  * REACT Components

* Controllers - `/server.js` - REACT Static Routes and `/api` routes for Mongo and Cheerio

* Model (Data) - `/model`
  * Uses Mongo and Mongoose for Data Layer