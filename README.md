# QuickEat Demo Project

QuickEat is web application of restaurat managemnt system designed to streamline operations.This system integrates various functionalities including customer management,order management,food items management with category, also payment integration,history of records.,data analytics.

## Key Features

- **User Authentication**: Secure login and registration processes for restaurant owners, ensuring safe and reliable access to their accounts. Utilize advanced security measures to protect user data and authentication credentials.
- **Customer Management**: Comprehensive tools for managing customer profiles. Users can effortlessly add new customers, delete existing ones, and access a complete list of all customers. This feature facilitates efficient handling of customer information and enhances customer service.
- **Food Item Management**: Equip restaurant owners with robust tools to manage their menu items. Users can add new dishes to their restaurant's menu, make updates to existing items, and delete any dish as needed. A comprehensive view of all menu items is also available, ensuring that users can maintain and update their offerings with ease and precision.
- **Category Management**: Allows users to efficiently organize their menu by adding new categories. This feature facilitates the management of menu items by grouping them under relevant categories, making it easier for customers to navigate the menu. Users can also view all items within a specific category, streamlining both backend organization and frontend user experience.
- **Order Management and Payment**: This module allows restaurant owners to efficiently handle orders by adding items to the cart, updating item quantities, and processing orders for specific customers. The system supports versatile payment options, including cash and card payments, facilitating a seamless checkout experience. It streamlines the entire order process from selection to payment, ensuring accuracy and customer satisfaction.
- **Payment and Order Details**: This feature provides comprehensive access to all payment and order details, empowering restaurant owners with the ability to oversee financial transactions and order histories. It also includes advanced functionalities such as generating and downloading invoices, ensuring that all financial and operational data is easily accessible and manageable for effective business administration.
- **Book Table**: This distinctive feature enables restaurant owners to customize and arrange their seating layout according to their preferences. Once the layout is established, owners can efficiently manage table bookings for their customers. This interactive tool not only simplifies the reservation process but also enhances the dining experience by allowing for tailored seating arrangements.
- **Analytical Dashboard**: This powerful dashboard offers comprehensive data visualizations that enable restaurant owners to quickly grasp their business performance. Features include daily and monthly sales trends, revenue breakdowns by category presented in pie charts, and summaries of total sales paid through card and cash. Additionally, the dashboard displays counts of total items, customers, and other critical metrics, aiding in strategic decision-making and operational adjustments.

## Technologies Used

QuickEat is built using the following technologies

- **Frontend**: NextJs,Redux For State Management and TailwindCSS For Styling
- **Backend**: NestJS
- **Database**: MongoDB for database management

## Installation

To get QuickEat up and running your local machine, follow these steps

1. **Clone The Repository**

   ```bash
   git clone https://github.com/ashishmakwanaaaa/QuickEatDemo.git
   cd QuickEat
   ```

2. **Install Backend Dependencies**

   ```bash
    cd Backend
    cd quickeatnest
    npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
    cd Frontend
    cd quickeatnext
    npm install
   ```

4. **Start The Server**

   - Frontend

   ```bash
    npm run dev
   ```

   - Backend

   ```bash
    npm start
   ```

## Environment Setup

Ensure your development environment is configured by setting up the necessary environment variables. Follow these steps to prepare both the frontend and backend settings:

### Frontend Setup (quickeatnext)

Create a `.env.local` file in the `Frontend/quickeatnext` directory and populate it with the following keys, which are necessary for integrating various services:

```bash
NEXT_PUBLIC_ACCESS_KEY_UNSPLASH=your_unsplash_access_key_here # Access key for generating dynamic images using the Unsplash API.
NEXT_PUBLIC_SERVICE_ID=your_emailjs_service_id_here # Service ID for EmailJS, enabling email sending functionalities.
NEXT_PUBLIC_TEMPLATE_ID=your_emailjs_template_id_here # Template ID for EmailJS to specify the email template.
NEXT_PUBLIC_USER_ID=your_emailjs_user_id_here # User ID for EmailJS to authenticate API requests.
```

### Backend Setup (quickeatnest)

Create a `.env` file in the `Backend/quickeatnest` directory and populate it with the following keys, which are necessary for integrating various services:

```bash
PORT=your_port_number_here # The port number on which the backend server will run.
MONGO_USERNAME=your_mongodb_username_here # Username for MongoDB Atlas.
MONGO_PASSWORD=your_mongodb_password_here # Password for MongoDB Atlas.
MONGO_CLUSTER=your_mongodb_cluster_name_here # Cluster name of your MongoDB Atlas.
MONGO_DATABASE=your_database_name_here # Database name to be used in the project.
EMAIL_SERVICE=your_email_service_provider_here # Email service provider for Nodemailer (e.g., Gmail, Outlook).
EMAIL_USERNAME=your_email_address_here # Email address used for sending emails.
EMAIL_PASSWORD=your_email_password_here # Password for the email account, usually an app-specific password.
JWT_SECRET=your_jwt_secret_key_here # Secret key for signing and verifying JWTs.
STRIPE_SECRET_KEY=your_stripe_secret_key_here # Secret key for Stripe to handle payment processing.

```

## Support and Contact Information

For support, contact quickeatwithus123@gmail.com

```bash

This README provides a structured and detailed introduction to your project, making it easier for others to understand, use, or contribute to QuickEat. Adjust the content to match the specific features, configurations, or other details relevant to your project.

```
