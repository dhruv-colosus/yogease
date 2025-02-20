
import { ArrowRight, Camera, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2d2d2d] text-white">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 ai-grid opacity-10 pointer-events-none"></div>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-medium mb-6 animate-fadeIn leading-tight">
              Perfect Your
              <span className="text-primary block"> Yoga Practice</span>
              <span className="ai-text text-4xl md:text-6xl block mt-2 text-white/90">with AI Guidance</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl animate-fadeIn typing-effect">
              Get real-time pose correction and personalized feedback to enhance your yoga journey.
            </p>
            <Link
              to="/yoga"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:transform hover:translate-y-[-2px] animate-fadeIn"
            >
              Try Now <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="relative w-full h-[400px] md:h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
              alt="Yoga Pose"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium text-center mb-12">
            Why Choose YogEase?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="text-primary" size={32} />,
                title: "Real-time Detection",
                description: "Advanced AI technology that tracks your poses with precision and accuracy.",
              },
              {
                icon: <Zap className="text-primary" size={32} />,
                title: "Instant Feedback",
                description: "Get immediate suggestions to improve your form and alignment.",
              },
              {
                icon: <Shield className="text-primary" size={32} />,
                title: "Safe Practice",
                description: "Prevent injuries with proper form guidance and personalized adjustments.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Set Up Your Camera",
                description: "Position your device camera to capture your full body.",
                image: "https://images.unsplash.com/photo-1593810450967-f9c42742e326",
              },
              {
                step: "02",
                title: "Choose Your Pose",
                description: "Select from our library of yoga poses to practice.",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
              },
              {
                step: "03",
                title: "Get Real-time Feedback",
                description: "Receive instant corrections and improvements for your poses.",
                image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5",
              },
            ].map((step, index) => (
              <div key={index} className="group">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="text-primary text-5xl font-bold opacity-90">
                      {step.step}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-medium mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium mb-6">
            Ready to Transform Your Yoga Practice?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of yogis who have improved their practice with YogEase.
          </p>
          <Link
            to="/yoga"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:transform hover:translate-y-[-2px]"
          >
            Get Started Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
