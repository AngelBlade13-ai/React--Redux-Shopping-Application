import React from "react";
import "./Contact.scss";

const ContactPage = () => {
  return (
    <div className="contactPage">
      <div className="hero">
        <h1>Contact NextHaul</h1>
        <p>
          Have a product, shipping, or return question? Send us a note and our
          team will get back to you within one business day.
        </p>
      </div>

      <div className="content">
        <form className="contactForm">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" placeholder="Your name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />

          <label htmlFor="subject">Subject</label>
          <input id="subject" type="text" placeholder="Order question, return, etc." />

          <label htmlFor="message">Message</label>
          <textarea id="message" rows="6" placeholder="How can we help?" />

          <button type="button">Send Message</button>
        </form>

        <div className="contactInfo">
          <h2>Support</h2>
          <p>Email: support@nexthaul.shop</p>
          <p>Phone: +1 (800) 555-0184</p>
          <p>Hours: Mon - Fri, 9:00 AM to 6:00 PM</p>

          <h2>Office</h2>
          <p>NextHaul HQ</p>
          <p>220 Market Street</p>
          <p>Denver, CO 80202</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
