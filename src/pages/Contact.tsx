import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const contactMethods = [
    {
      id: 'phone',
      icon: Phone,
      iconColor: '#2196F3',
      iconBg: 'rgba(33, 150, 243, 0.1)',
      title: 'Phone',
      detail1: '+234 XXX XXX XXXX',
      detail2: 'Mon-Sun 24/7',
    },
    {
      id: 'email',
      icon: Mail,
      iconColor: '#00C950',
      iconBg: 'rgba(0, 201, 80, 0.1)',
      title: 'Email',
      detail1: 'support@joscity.gov',
      detail2: 'Response in 24hrs',
    },
    {
      id: 'location',
      icon: MapPin,
      iconColor: '#9C27B0',
      iconBg: 'rgba(156, 39, 176, 0.1)',
      title: 'Location',
      detail1: 'Jos City Center',
      detail2: 'Plateau State, Nigeria',
    },
  ];

  return (
    <section className="contact">
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
              <div key={method.id} className="contact__card">
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

