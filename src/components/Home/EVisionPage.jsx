import React, { useEffect } from "react";
import carPng from "../../assets/car.png";
import yellowCar from "../../assets/banner-car.png";
import CarPng from "../../assets/car1.png";
import whiteCar from "../../assets/white-car.png";
import car2 from "../../assets/car5.png";
import car3 from "../../assets/car6.png";
import AppStoreImg from "../../assets/website/app_store.png";
import PlayStoreImg from "../../assets/website/play_store.png";
import pattern from "../../assets/website/pattern.jpeg";
import AOS from "aos";
import { FaCameraRetro } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { SlNote } from "react-icons/sl";

// Data for Skills, Car List, and Testimonials
const skillsData = [
  {
    name: "Affordable and Transparent Pricing",
    icon: <FaCameraRetro className="text-5xl text-primary group-hover:text-black duration-300" />,
    description: "Get the best value with clear, competitive pricing for all our EV services.",
    aosDelay: "0",
  },
  {
    name: "Fast and Reliable Service",
    icon: <GiNotebook className="text-5xl text-primary group-hover:text-black duration-300" />,
    description: "Enjoy quick, safe, and dependable EV charging and maintenance support.",
    aosDelay: "500",
  },
  {
    name: "Expert Providers",
    icon: <SlNote className="text-5xl text-primary group-hover:text-black duration-500" />,
    description: "Our experienced providers ensure top-quality service to keep your EV running smoothly.",
    aosDelay: "1000",
  },
];
const carList = [
  { name: "Fiat", image: whiteCar, aosDelay: "0" },
  { name: "BYD", image: car2, aosDelay: "500" },
  { name: "Changan", image: car3, aosDelay: "1000" },
];
const testimonialData = [
  { name: "Dilshad", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.", aosDelay: "0" },
  { name: "Satya", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.", aosDelay: "300" },
  { name: "Sabir", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.", aosDelay: "1000" },
];

const EVisionPage = ({ theme }) => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  const bannerImg = {
    backgroundImage: `url(${pattern})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  };

  return (
    <div className="dark:bg-black dark:text-white duration-300">
      {/* Hero Section */}
      <section className="container min-h-[620px] flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
          <div data-aos="zoom-in" data-aos-duration="1500" className="order-1 sm:order-2">
            <img
              src={theme === "dark" ? carPng : yellowCar}
              alt="EVision Car"
              className="sm:scale-125 max-h-[600px] drop-shadow-[2px_20px_6px_rgba(0,0,0,0.50)]"
            />
          </div>
          <div className="space-y-5 order-2 sm:order-1 sm:pr-32">
            <p data-aos="fade-up" className="text-primary text-2xl font-serif">Effortless EVision</p>
            <p data-aos="fade-up" data-aos-delay="1000">
              Simplify your electric vehicle experience with our comprehensive services. From booking charging stations
              to scheduling maintenance, we’re here to support you every step of the way.
            </p>
            <button data-aos="fade-up" data-aos-delay="1500" className="rounded-md bg-primary py-2 px-6 text-black">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="dark:bg-dark bg-slate-100 sm:min-h-[600px] sm:grid sm:place-items-center">
        <div className="container grid grid-cols-1 sm:grid-cols-2 place-items-center">
          <div data-aos="slide-right" data-aos-duration="1500">
            <img src={CarPng} alt="Car" className="sm:scale-125 sm:-translate-x-11 max-h-[300px]" />
          </div>
          <div className="space-y-5 sm:p-16">
            <h1 data-aos="fade-up" className="text-3xl font-bold font-serif">About Us</h1>
            <p data-aos="fade-up">
              Welcome to our EV Charging Station and Service Management platform! Our app lets users manage their
              electric vehicles, book charging stations, and schedule maintenance.
            </p>
            <button data-aos="fade-up" className="button-outline">Get Started</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="dark:bg-black py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
        <div className="container pb-12 text-center">
          <h1 data-aos="fade-up" className="text-3xl font-serif font-semibold">Why Choose Us</h1><br/>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillsData.map((skill) => (
              <div
                key={skill.name}
                data-aos="fade-up"
                data-aos-delay={skill.aosDelay}
                className="card text-center group p-4 bg-dark text-white hover:bg-primary rounded-lg"
              >
                <div className="grid place-items-center">{skill.icon}</div>
                <h1 className="text-2xl font-bold">{skill.name}</h1>
                <p>{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car List Section */}
      <section className="pb-24">
        <div className="container">
          <h1 data-aos="fade-up" className="text-3xl font-serif font-semibold mb-3">Electric Vehicles We Support</h1>
          <p data-aos="fade-up" className="text-sm pb-10">Explore a selection of popular EV models for which we provide reliable charging and maintenance services.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {carList.map((data) => (
              <div key={data.name} data-aos="fade-up" data-aos-delay={data.aosDelay} className="border-2 p-3 rounded-xl group">
                <img src={data.image} alt={data.name} className="w-full h-[120px] object-contain group-hover:translate-x-8 duration-700" />
                <h1 className="text-primary font-semibold">{data.name}</h1>
                <a href="#" className="text-xl font-semibold">Details</a>
              </div>
            ))}
          </div>
          <div className="grid place-items-center mt-8">
            <button data-aos="fade-up" className="button-outline">Get Started</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="dark:bg-black py-14 sm:pb-24">
        <div className="container text-center">
          <p data-aos="fade-up" className="text-3xl font-serif font-semibold">What Our Clients Say About Us</p> <br/>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black dark:text-white">
            {testimonialData.map((testimonial) => (
              <div key={testimonial.name} data-aos="fade-up" data-aos-delay={testimonial.aosDelay} className="card group p-4 bg-gray-100 dark:bg-white/20 rounded-lg">
                <img src="https://picsum.photos/200" alt="" className="rounded-full w-20 h-20" />
                <div className="text-2xl">⭐⭐⭐⭐⭐</div>
                <p>{testimonial.description}</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store Banner */}
      <section className="container" style={bannerImg}>
        <div className="py-10 text-center sm:min-h-[400px] rounded-xl">
          <h1 data-aos="fade-up" className="text-2xl sm:text-4xl font-serif font-semibold">Get Started with our App</h1> <br/><br/><br/>
          <p data-aos="fade-up">Easily manage your electric vehicle, book charging stations, and schedule maintenance.</p><br/><br/>
          <div data-aos="fade-up" className="flex justify-center gap-4 mt-4">
            <img src={AppStoreImg} alt="App Store" className="w-40 rounded-md" />
            <img src={PlayStoreImg} alt="Play Store" className="w-40 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default EVisionPage;
