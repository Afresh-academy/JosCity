import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const Contact: React.FC = () => {
  const contactMethods = [
    {
      id: "phone",
      icon: Phone,
      iconColor: "#2196F3",
      iconBg: "rgba(33, 150, 243, 0.1)",
      title: "Phone",
      detail1: "+234 7067621916",
      detail2: "Mon - Sat 24/7",
      action: () => {
        window.location.href = "tel:+234 7067621916";
      },
    },
    {
      id: "email",
      icon: Mail,
      iconColor: "#00C950",
      iconBg: "rgba(0, 201, 80, 0.1)",
      title: "Email",
      detail1: "support@afresh.academy",
      detail2: "Response in 24 hours",
      action: () => {
        window.location.href = "mailto:support@afresh.academy";
      },
    },
    {
      id: "location",
      icon: MapPin,
      iconColor: "#9C27B0",
      iconBg: "rgba(156, 39, 176, 0.1)",
      title: "Location",
      detail1: "Jos City Center",
      detail2: "Plateau State, Nigeria",
      action: () => {
        const address = encodeURIComponent(
          "Jos City Center, Plateau State, Nigeria"
        );
        window.open(
          `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15723.033480422853!2d8.871507993915424!3d9.870628226907453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105374831abc0e1f%3A0xc8061ae6c03b94cd!2s75%20Yakubu%20Gowon%20Way%2C%20Jos%20930104%2C%20Plateau!5e0!3m2!1sen!2sng!4v1764023260145!5m2!1sen!2sng"=${address}`,
          "_blank"
        );
      },
    },
  ];

  return (
    <section id="contact" className="contact">
      <div className="contact__container">
        <div className="contact__hero">
          <div className="contact__badge">
            <Phone size={16} />
            <span>Contact Us</span>
          </div>
          <h1 className="contact__heading">Get in Touch</h1>
          <p className="contact__subheading">
            Our support team is available 24/7 to assist you
          </p>
        </div>

        <div className="contact__grid">
          {contactMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div
                key={method.id}
                className="contact__card"
                onClick={method.action}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    method.action();
                  }
                }}
              >
                <div
                  className="contact__card-icon"
                  style={{
                    backgroundColor: method.iconBg,
                    color: method.iconColor,
                  }}
                >
                  <IconComponent size={24} />
                </div>
                <h3 className="contact__card-title">{method.title}</h3>
                <p className="contact__card-detail">{method.detail1}</p>
                <p className="contact__card-detail contact__card-detail--secondary">
                  {method.detail2}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
