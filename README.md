# JI-Consultation
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Development Consultation</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header Section -->
    <header>
        <h1>Grow Your Business with Expert Guidance</h1>
        <p>Helping businesses scale, optimize, and increase revenue.</p>
        <a href="#contact" class="cta-button">Book a Consultation</a>
    </header>

    <!-- Services Section -->
    <section id="services">
        <h2>What I Offer</h2>
        <div class="service">
            <h3>Business Growth Strategy</h3>
            <p>Custom strategies to scale your business.</p>
        </div>
        <div class="service">
            <h3>Sales & Lead Generation</h3>
            <p>Proven methods to increase conversions and revenue.</p>
        </div>
        <div class="service">
            <h3>Branding & Marketing</h3>
            <p>Position your business for success in the digital world.</p>
        </div>
    </section>

    <!-- Process Section -->
    <section id="process">
        <h2>How It Works</h2>
        <ul>
            <li><strong>Step 1:</strong> Book a free discovery call.</li>
            <li><strong>Step 2:</strong> Get a tailored business growth strategy.</li>
            <li><strong>Step 3:</strong> Implement, track, and optimize.</li>
        </ul>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <h2>Get in Touch</h2>
        <p>Let's work together to grow your business.</p>
        <form id="contact-form">
            <input type="text" id="name" placeholder="Your Name" required>
            <input type="email" id="email" placeholder="Your Email" required>
            <textarea id="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </section>

    <script src="script.js"></script>
</body>
</html>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    text-align: center;
    background-color: #f4f4f4;
}

header {
    background: #007bff;
    color: white;
    padding: 50px 20px;
}

h1 {
    margin: 0;
}

.cta-button {
    background: white;
    color: #007bff;
    padding: 10px 20px;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin-top: 10px;
}

#services, #process, #contact {
    padding: 40px 20px;
    background: white;
    margin: 20px;
    border-radius: 10px;
}

.service {
    margin: 20px 0;
}

form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: auto;
}

input, textarea {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
}

button {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
}

button:hover {
    background: #0056b3;
}
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    console.log("Message Sent: ", name, email, message);
    alert("Thank you! Your message has been sent.");
});
