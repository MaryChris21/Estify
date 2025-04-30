import React from "react";
import LayoutWrapper from "../Components/LayoutWrapper";
import { useNavigate } from "react-router-dom";
import { Home, Building2, BarChart3, ActivitySquare } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Homepage = () => {
  const navigate = useNavigate();

  const carouselImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  ];

  return (
    <LayoutWrapper>
      <main className="px-10 py-20 flex flex-col justify-center min-h-[calc(100vh-140px)]">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">
            Welcome to <span className="text-yellow-600">Estify</span>
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Your gateway to premium Sri Lankan real estate — curated listings,
            agent tools, and market insights.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-lg">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={2000}
            showStatus={false}
            dynamicHeight={false}
          >
            {carouselImages.map((src, idx) => (
              <div key={idx}>
                <img
                  src={src}
                  alt={`Carousel ${idx + 1}`}
                  className="object-cover h-[400px] w-full"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Cards Section */}
        <div className="grid gap-8 md:grid-cols-3 text-center">
          <div className="bg-white/70 backdrop-blur p-6 rounded-2xl shadow-lg border border-green-100 hover:scale-105 transition">
            <Home className="mx-auto text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
            <p className="text-gray-600 mb-4">
              View all available properties across districts.
            </p>
            <button
              onClick={() => navigate("/userProperties")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Properties
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur p-6 rounded-2xl shadow-lg border border-yellow-100 hover:scale-105 transition">
            <Building2 className="mx-auto text-yellow-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Agent Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Login to manage your listings and ad requests.
            </p>
            <button
              onClick={() => navigate("/agent-login")}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Agent Portal
            </button>
          </div>

          <div className="bg-white/70 backdrop-blur p-6 rounded-2xl shadow-lg border border-purple-200 hover:scale-105 transition">
            <ActivitySquare className="mx-auto text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Value Prediction</h3>
            <p className="text-gray-600 mb-4">
              Estimate your property’s market value with smart tools.
            </p>
            <button
              onClick={() => navigate("/predict-value")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Predict Value
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          {[{
            title: "Verified Listings",
            desc: "We verify every property to ensure quality and legitimacy."
          }, {
            title: "Trusted Agents",
            desc: "Work with top-rated agents across Sri Lanka."
          }, {
            title: "Seamless Booking",
            desc: "Book properties in just a few clicks with secure checkout."
          }].map((feature, i) => (
            <div key={i} className="bg-white/80 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-bold text-green-700 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-20 bg-green-600 text-white text-center p-10 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Ready to find your dream property?</h3>
          <p className="mb-4">Explore listings, connect with agents, or start managing your own ads.</p>
          <button
            onClick={() => navigate("/userProperties")}
            className="bg-white text-green-700 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Get Started
          </button>
        </div>

        {/* Testimonials */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">What Our Users Say</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[{
              name: "Tharindu",
              quote: "Estify helped me find a great apartment in Colombo in just 2 days!"
            }, {
              name: "Amali",
              quote: "As an agent, this platform made it easy to manage my listings."
            }].map((t, i) => (
              <div key={i} className="bg-white/80 backdrop-blur p-6 rounded-xl shadow">
                <p className="italic text-gray-600">"{t.quote}"</p>
                <p className="mt-4 text-sm font-bold text-green-700">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </LayoutWrapper>
  );
};

export default Homepage;
