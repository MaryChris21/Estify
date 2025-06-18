"use client"
import { useState, useEffect } from "react"
import LayoutWrapper from "../Components/LayoutWrapper"
import { useNavigate } from "react-router-dom"
import { Home, Building2, ActivitySquare, Search, MapPin, Phone, Mail, ArrowRight, Star, Check } from "lucide-react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import axios from "axios"
import toast from "react-hot-toast"

const Homepage = () => {
  const navigate = useNavigate()
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Sample featured properties data
  const sampleProperties = [
    {
      _id: "prop1",
      title: "Luxury Villa in Colombo",
      price: 45000000,
      location: "Colombo 7",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    },
    {
      _id: "prop2",
      title: "Modern Apartment in Kandy",
      price: 25000000,
      location: "Kandy",
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      imageUrl:
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      _id: "prop3",
      title: "Beachfront Home in Galle",
      price: 55000000,
      location: "Galle",
      bedrooms: 5,
      bathrooms: 4,
      area: 3200,
      imageUrl:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ]

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await axios.get("/api/properties/featured")
        if (response.data && Array.isArray(response.data)) {
          setFeaturedProperties(response.data.slice(0, 3))
        } else {
          // If response is not an array, use sample data
          setFeaturedProperties(sampleProperties)
          console.warn("API response is not an array, using sample data")
        }
      } catch (error) {
        console.error("Failed to fetch featured properties:", error)
        // Use placeholder data if API fails
        setFeaturedProperties(sampleProperties)
        // Show a toast notification instead of an alert
        toast.error("Could not load featured properties. Using sample data instead.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  const carouselImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <LayoutWrapper>
      {/* Hero Section - Enhanced */}
      <section className="relative">
        {/* Carousel */}
        <div className="relative h-[70vh] overflow-hidden">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={3000}
            showStatus={false}
            dynamicHeight={false}
            showArrows={true}
            className="h-full"
          >
            {carouselImages.map((src, idx) => (
              <div key={idx} className="relative h-[70vh]">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Carousel ${idx + 1}`}
                  className="object-cover h-full w-full brightness-[0.7]"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}
          </Carousel>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center text-white drop-shadow-lg">
              Find Your Dream Home in <span className="text-yellow-400">Sri Lanka</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-center mb-8 drop-shadow-md">
              Discover premium properties across the island with Estify
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - New */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "1,200+", label: "Properties" },
              { value: "500+", label: "Happy Clients" },
              { value: "150+", label: "Verified Agents" },
              { value: "25+", label: "Districts Covered" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-green-700">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate solutions tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse Listings</h3>
              <p className="text-gray-600 mb-6">
                Explore verified properties across Sri Lanka with detailed information and high-quality images.
              </p>
              <button
                onClick={() => navigate("/userProperties")}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
              >
                View Properties <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-yellow-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Agent Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Powerful tools for agents to manage listings, track inquiries, and connect with potential buyers.
              </p>
              <button
                onClick={() => navigate("/agent-login")}
                className="bg-yellow-600 text-white px-5 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Agent Portal <ArrowRight size={16} />
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-500 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ActivitySquare className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Value Prediction</h3>
              <p className="text-gray-600 mb-6">
                Advanced AI-powered tools to estimate property values based on location, features, and market trends.
              </p>
              <button
                onClick={() => navigate("/valuation-tool")}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Predict Value <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - New */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured <span className="text-green-700">Properties</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Handpicked premium properties from across Sri Lanka</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties && featuredProperties.length > 0 ? (
                featuredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={property.imageUrl || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{property.title}</h3>
                      <div className="flex items-center mb-3">
                        <MapPin size={16} className="text-gray-500 mr-1" />
                        <span className="text-gray-600">{property.location}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">{property.bedrooms} beds</span>
                          <span className="text-gray-600 mr-2">•</span>
                          <span className="text-gray-600 mr-2">{property.bathrooms} baths</span>
                          <span className="text-gray-600 mr-2">•</span>
                          <span className="text-gray-600">{property.area} sqft</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-green-700">{formatPrice(property.price)}</p>
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No featured properties available at the moment.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/userProperties")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              View All Properties <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - New */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-green-700">Estify</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best real estate experience in Sri Lanka
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                alt="Real Estate Team"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <div className="space-y-6">
                {[
                  {
                    title: "Verified Listings",
                    desc: "Every property is verified by our team to ensure quality and legitimacy.",
                  },
                  {
                    title: "Expert Agents",
                    desc: "Work with experienced, professional agents who know the local market.",
                  },
                  {
                    title: "Transparent Process",
                    desc: "Clear, straightforward transactions with no hidden fees or surprises.",
                  },
                  {
                    title: "Dedicated Support",
                    desc: "Our customer service team is available to assist you every step of the way.",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Check className="text-green-600" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our <span className="text-green-700">Clients Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience with Estify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Tharindu Perera",
                role: "Homeowner",
                quote:
                  "Estify helped me find my dream home in Colombo. The process was smooth and the agent was incredibly helpful throughout.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5,
              },
              {
                name: "Amali Fernando",
                role: "Real Estate Agent",
                quote:
                  "As an agent, this platform has made it so much easier to manage my listings and connect with potential buyers.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 5,
              },
              {
                name: "Rajiv Mendis",
                role: "Property Investor",
                quote:
                  "The valuation tool is incredibly accurate. I've used it for multiple investment properties and it's been spot on every time.",
                avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                rating: 4,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found their perfect home with Estify
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/userProperties")}
                  className="bg-white text-green-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Properties
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - New */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Estify</h3>
              <p className="text-gray-400 mb-4">Your trusted partner in finding the perfect property in Sri Lanka.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Agents
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Valuation Tool
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Property Types</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Houses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Apartments
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Villas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Commercial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Land
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="text-green-500 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-400">123 Main Street, Colombo 03, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-green-500 flex-shrink-0" size={18} />
                  <span className="text-gray-400">+94 11 234 5678</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-green-500 flex-shrink-0" size={18} />
                  <span className="text-gray-400">info@estify.lk</span>
                </li>
              </ul>
            </div>
          </div>

          
        </div>
      </footer>
    </LayoutWrapper>
  )
}

export default Homepage


