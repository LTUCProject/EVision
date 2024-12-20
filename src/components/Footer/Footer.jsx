import React from "react";
import ibraheem from "../../assets/ibraheem.png";
import jafar from "../../assets/jafar.jpg";
import Abed from "../../assets/abed2.jpg";
import Moayad from "../../assets/moayad2.jpg";
import yazan from "../../assets/yazan.jpg";
import yassin from "../../assets/yassin.jpg";


import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaEnvelope,
} from "react-icons/fa";

const teamMembers = [
  {
    name: "Ibrahim Nemer",
    specialization: "Electrical Engineer",
    image: ibraheem,
  },
  {
    name: "Jafar Ramadan",
    specialization: "Software Engineer",
    image: jafar,
  },
  {
    name: "Moayad Hamdan",
    specialization: "Software Engineer",
    image: Moayad,
  },
  {
    name: "Abed Radwan",
    specialization: "Software Engineer",
    image: Abed,
  },
  {
    name: "Yassin",
    specialization: "Frontend Developer",
    image: yassin,
  },
  {
    name: "Yazan",
    specialization: "Frontend Developer",
    image: yazan,
  },
];

const Footer = () => {
  return (
    <div className="bg-gray-100 dark:bg-dark mt-14 rounded-t-3xl">
      <section className="container">
        <div className="grid md:grid-cols-3 py-5">
          {/* Company Details */}
          <div className="py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 font-serif">
              EVISION
            </h1>
            {/* <p className="text-sm" style={{ color: "black" }}>
              We offer comprehensive support for your electric vehicle, from
              charging station bookings to maintenance scheduling. Our team is
              dedicated to keeping your EV in top condition.
            </p> */}
            <br /> <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <div className="flex items-center gap-3">
              <FaLocationArrow />
              <p style={{ color: "black" }}>Amman, Jordan</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <FaEnvelope />
              <p style={{ color: "black" }}>electrovehicleworld@gmail.com</p>
            </div>
            {/* Social Handle */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl hover:text-primary duration-300" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl hover:text-primary duration-300" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl hover:text-primary duration-300" />
              </a>
            </div>
          </div>
          {/* About Us Section */}
          <div className="col-span-2 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="sm:text-2xl text-xl font-bold sm:text-left text-justify mb-5">
                About Us
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-4 text-center"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 mx-auto rounded-full mb-4"
                    />
                    <h2 className="text-lg font-semibold">{member.name}</h2>
                    <p className="text-sm text-gray-600">
                      {member.specialization}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
