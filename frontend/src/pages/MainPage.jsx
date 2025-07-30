// src/pages/MainPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CalendarDays, CreditCard, Users } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const MainPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const features = [
    {
      title: "Attendance Tracking",
      desc: "Mark and monitor student attendance by class or subject with ease and accuracy.",
      icon: <CalendarDays className="h-12 w-12 text-blue-400" />, 
    },
    {
      title: "Fee Collection",
      desc: "Automated fee tracking and payment collection, integrated with popular gateways.",
      icon: <CreditCard className="h-12 w-12 text-green-400" />, 
    },
    {
      title: "Parent Portal",
      desc: "Parents can securely view student reports, attendance, and important updates.",
      icon: <Users className="h-12 w-12 text-indigo-400" />, 
    },
  ];

  return (
    <div className="bg-gray-900 text-white font-['Poppins']">
      {/* Navbar */}
      <header className="bg-gray-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-white bg-blue-600 px-3 py-1 rounded-lg shadow-md">
            Stud
          </Link>
          <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
            <a href="#" className="hover:text-blue-400">Home</a>
            <a href="#product" className="hover:text-blue-400">Product</a>
            <a href="#pricing" className="hover:text-blue-400">Pricing</a>
            <a href="#about" className="hover:text-blue-400">About Us</a>
            <a href="#contact" className="hover:text-blue-400">Contact</a>
          </nav>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden" data-aos="fade-up">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-6">
          Revolutionizing Student Information Systems
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
          Manage attendance, fees, documents, parent portals and more — all in one seamless, intuitive platform.
        </p>
        <Link to="/login">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-10 py-4 rounded-full font-semibold text-white shadow-2xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition">
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Product Section */}
      <section id="product" className="py-24 bg-gray-900/50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            Everything your institution needs to operate efficiently and engage your community.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ title, desc, icon }) => (
              <div key={title} className="bg-gray-800/50 p-8 rounded-2xl shadow-lg transition hover:-translate-y-2" data-aos="zoom-in">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 mb-6">
                  {icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-extrabold mb-6 text-white">Flexible Pricing Plans</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
            Affordable, scalable plans for schools and colleges. Choose the right plan anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-8" data-aos="zoom-in">
            <div className="rounded-2xl p-10 bg-gray-800/60 text-left shadow-lg transition hover:-translate-y-2 duration-300">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-4xl font-extrabold mb-6">₹0/mo</p>
              <ul className="space-y-3 text-gray-300 mb-8 text-lg">
                <li>✅ Basic Attendance</li>
                <li>✅ Student Profiles</li>
              </ul>
            </div>
            <div className="rounded-2xl p-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-left shadow-xl transform -translate-y-4">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl font-extrabold mb-6">₹999/mo</p>
              <ul className="space-y-3 text-white/90 mb-8 text-lg">
                <li>✅ All Free Features</li>
                <li>✅ Fee Module</li>
                <li>✅ Parent Portal</li>
              </ul>
            </div>
            <div className="rounded-2xl p-10 bg-gray-800/60 text-left shadow-lg transition hover:-translate-y-2 duration-300">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl font-extrabold mb-6">Contact Us</p>
              <ul className="space-y-3 text-gray-300 mb-8 text-lg">
                <li>✅ Custom Integrations</li>
                <li>✅ Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-gray-950" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left" data-aos="fade-right">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
              Get in Touch
            </h2>
            <p className="text-gray-400 mb-8 text-lg">Have questions or need a custom plan?</p>
          </div>
          <div className="bg-gray-800/60 p-8 rounded-2xl shadow-xl" data-aos="zoom-in">
            <form className="space-y-6">
              <input type="text" placeholder="Your Name" className="w-full rounded-lg bg-gray-900/50 border border-gray-700 p-4 text-white" />
              <input type="email" placeholder="Your Email" className="w-full rounded-lg bg-gray-900/50 border border-gray-700 p-4 text-white" />
              <textarea placeholder="Your Message" rows="6" className="w-full rounded-lg bg-gray-900/50 border border-gray-700 p-4 text-white resize-none"></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-4 rounded-full font-semibold text-white text-lg hover:from-blue-600 hover:to-indigo-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Stud. All Rights Reserved.
      </footer>
    </div>
  );
};

export default MainPage;