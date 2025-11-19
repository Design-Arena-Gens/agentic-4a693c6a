'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, MapPin, Phone, Clock, Shield, DollarSign,
  Star, Menu, X, Mic, MicOff, Navigation, User,
  ChevronRight, Check, TrendingUp
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedService, setSelectedService] = useState('standard');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeRides, setActiveRides] = useState(127);
  const [voiceCommand, setVoiceCommand] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Simulate live ride updates
    const rideInterval = setInterval(() => {
      setActiveRides(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(rideInterval);
    };
  }, []);

  const startVoiceNavigation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceCommand('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceCommand(`You said: "${transcript}"`);

      setTimeout(() => {
        if (transcript.includes('book') || transcript.includes('ride')) {
          setShowBookingModal(true);
          speak('Opening booking form');
        } else if (transcript.includes('price') || transcript.includes('cost')) {
          scrollToSection('pricing');
          speak('Showing pricing information');
        } else if (transcript.includes('about')) {
          scrollToSection('about');
          speak('Showing about section');
        } else if (transcript.includes('contact') || transcript.includes('call')) {
          scrollToSection('contact');
          speak('Showing contact information');
        } else if (transcript.includes('home')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          speak('Going to home');
        } else {
          speak('Sorry, I did not understand that command. Try saying book ride, pricing, about, or contact.');
        }
        setVoiceCommand('');
      }, 1500);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setVoiceCommand('');
      console.error('Speech recognition error', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      id: 'standard',
      name: 'Standard',
      icon: Car,
      price: '$8-12',
      description: 'Affordable rides for everyday travel',
      features: ['4 seats', 'AC', 'Standard wait time']
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Car,
      price: '$15-25',
      description: 'Comfortable rides in premium vehicles',
      features: ['4 seats', 'Luxury cars', 'Priority pickup']
    },
    {
      id: 'xl',
      name: 'XL',
      icon: Car,
      price: '$12-18',
      description: 'Extra space for groups',
      features: ['6+ seats', 'More space', 'AC']
    }
  ];

  const stats = [
    { label: 'Active Rides', value: activeRides, icon: TrendingUp },
    { label: 'Happy Customers', value: '50K+', icon: User },
    { label: 'Cities', value: '25', icon: MapPin },
    { label: 'Avg Rating', value: '4.8', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <nav className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                FairGo
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition">About</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition">Pricing</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition">Contact</a>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime}</span>
                </div>
                <button
                  onClick={startVoiceNavigation}
                  className={`p-2 rounded-full transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-700 hover:bg-primary-100'
                  }`}
                  title="Voice Navigation"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 space-y-3"
              >
                <a href="#about" className="block text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#pricing" className="block text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                <a href="#contact" className="block text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{currentTime}</span>
                  </div>
                  <button
                    onClick={startVoiceNavigation}
                    className={`p-2 rounded-full transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Voice Command Feedback */}
        <AnimatePresence>
          {voiceCommand && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-primary-500 text-white text-center py-2 px-4 text-sm"
            >
              {voiceCommand}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Ride, Your Way with{' '}
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  FairGo
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Safe, reliable, and affordable rides at your fingertips. Book in seconds with voice commands or tap to go.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition flex items-center justify-center space-x-2"
                >
                  <Car className="w-5 h-5" />
                  <span>Book a Ride Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={startVoiceNavigation}
                  className="border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition flex items-center justify-center space-x-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Use Voice Command</span>
                </button>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-xl shadow-sm"
                  >
                    <stat.icon className="w-5 h-5 text-primary-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-300/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl" />
                <div className="relative">
                  <Car className="w-full h-64 text-primary-600 animate-float" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Ride
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect ride for your journey. All prices are estimates based on distance and time.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedService(service.id)}
                className={`relative p-6 rounded-2xl cursor-pointer transition ${
                  selectedService === service.id
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl scale-105'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {selectedService === service.id && (
                  <div className="absolute top-4 right-4 bg-white text-primary-600 rounded-full p-1">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                <service.icon className={`w-12 h-12 mb-4 ${
                  selectedService === service.id ? 'text-white' : 'text-primary-600'
                }`} />
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <div className="text-3xl font-bold mb-4">{service.price}</div>
                <p className={`mb-4 ${
                  selectedService === service.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <Check className={`w-4 h-4 ${
                        selectedService === service.id ? 'text-white' : 'text-primary-600'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FairGo?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best ride-hailing experience with cutting-edge features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'All drivers verified with background checks. Real-time GPS tracking for your safety.'
              },
              {
                icon: DollarSign,
                title: 'Fair Pricing',
                description: 'Transparent pricing with no hidden fees. See your fare estimate before you book.'
              },
              {
                icon: Clock,
                title: '24/7 Availability',
                description: 'Need a ride at 3 AM? We got you covered. Available round the clock, every day.'
              },
              {
                icon: Star,
                title: 'Top Rated Drivers',
                description: 'Our drivers maintain high ratings and excellent customer service standards.'
              },
              {
                icon: Mic,
                title: 'Voice Navigation',
                description: 'Hands-free booking and navigation with our advanced voice command system.'
              },
              {
                icon: Navigation,
                title: 'Real-time Tracking',
                description: 'Track your driver in real-time and get accurate arrival estimates.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 sm:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-white/90 mb-6">
                    Have questions? Need support? We're here to help 24/7.
                  </p>

                  <div className="space-y-4">
                    <a href="tel:1-800-FAIRGO" className="flex items-center space-x-3 group">
                      <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm text-white/80">Call us</div>
                        <div className="text-lg font-semibold">1-800-FAIRGO</div>
                      </div>
                    </a>

                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm text-white/80">Available in</div>
                        <div className="text-lg font-semibold">25 Cities Nationwide</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Active Rides Now</span>
                      <span className="text-2xl font-bold">{activeRides}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Avg. Pickup Time</span>
                      <span className="text-2xl font-bold">3 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Customer Rating</span>
                      <span className="text-2xl font-bold">4.8⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full sm:w-auto bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2 mx-auto"
                >
                  <Car className="w-5 h-5" />
                  <span>Book Your Ride Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">FairGo</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted ride-hailing partner for safe, reliable, and affordable transportation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#pricing" className="hover:text-white transition">Ride Options</a></li>
                <li><a href="#" className="hover:text-white transition">Business</a></li>
                <li><a href="#" className="hover:text-white transition">Safety</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} FairGo. All rights reserved. | Making rides fair for everyone.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Book Your Ride</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter pickup address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter destination"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Standard - $8-12</option>
                    <option>Premium - $15-25</option>
                    <option>XL - $12-18</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('🎉 Ride booked! A driver will be assigned shortly. You will receive a confirmation call.');
                    setShowBookingModal(false);
                  }}
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Command Help */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-lg p-4 max-w-xs hidden sm:block"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Mic className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Voice Commands</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• "Book ride"</li>
              <li>• "Show pricing"</li>
              <li>• "Contact us"</li>
              <li>• "Go to home"</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
