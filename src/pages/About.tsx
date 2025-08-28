import React from 'react';
import { Shield, Award, Users, Heart, Mountain, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority. We use certified equipment and follow strict safety protocols.'
    },
    {
      icon: Award,
      title: 'Expert Guides',
      description: 'Our certified guides have extensive knowledge of local terrain and mountain rescue techniques.'
    },
    {
      icon: Users,
      title: 'Small Groups',
      description: 'We keep group sizes small to ensure personalized attention and minimal environmental impact.'
    },
    {
      icon: Heart,
      title: 'Passion for Nature',
      description: 'We are passionate about sharing the beauty of Kerala\'s mountains with fellow nature lovers.'
    },
    {
      icon: Mountain,
      title: 'Local Expertise',
      description: 'Deep understanding of local culture, weather patterns, and hidden gems in the Western Ghats.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Committed to sustainable tourism practices that preserve nature for future generations.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & Lead Guide',
      image: 'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
      experience: '8 years'
    },
    {
      name: 'Priya Nair',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
      experience: '5 years'
    },
    {
      name: 'Arun Menon',
      role: 'Senior Trek Guide',
      image: 'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
      experience: '6 years'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: 'url(https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg)'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">About Kerala Treks</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Your trusted partner for authentic Kerala trekking experiences
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Kerala Treks was founded in 2019 with a simple mission: to share the breathtaking beauty 
                  of Kerala's Western Ghats with adventure enthusiasts from around the world. What started 
                  as a passion project by a group of local mountain guides has grown into Kerala's most 
                  trusted trekking company.
                </p>
                <p className="text-lg">
                  We believe that the mountains have a unique way of bringing out the best in people. 
                  Through our carefully curated trekking experiences, we've helped thousands of adventurers 
                  discover not just the stunning landscapes of Kerala, but also their own inner strength 
                  and connection with nature.
                </p>
                <p className="text-lg">
                  Our team consists of local guides who have grown up in these mountains, ensuring that 
                  every trek is not just an adventure, but also a cultural journey through the heart of Kerala.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg"
                alt="Our team"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 rounded-lg">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Happy Trekkers</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced professionals passionate about adventure and nature
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.experience} experience</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-emerald-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Happy Customers' },
              { value: '25+', label: 'Trek Routes' },
              { value: '5', label: 'Years Experience' },
              { value: '100%', label: 'Safety Record' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;