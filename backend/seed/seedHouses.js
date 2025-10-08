require("dotenv").config();
const mongoose = require("mongoose");
const House = require("../models/House");

// Base URL for images
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Full houses data from FE data.js (18 houses total)
const housesData = [
  {
    type: "House",
    name: "House 1",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: `${BASE_URL}/assets/img/houses/house1.png`,
    imageLg: `${BASE_URL}/assets/img/houses/house1lg.png`,
    country: "United States",
    address: "7240C Argyle St. Lawndale, CA 90260",
    bedrooms: "6",
    bathrooms: "3",
    surface: "4200 sq ft",
    year: "2016",
    price: 110000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent1.png",
      name: "Patricia Tullert",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house2.png",
    imageLg: "/assets/img/houses/house2lg.png",
    country: "Canada",
    address: "798 Talbot St. Bridgewater, NJ 08807",
    bedrooms: "6",
    bathrooms: "3",
    surface: "4200 sq ft",
    year: "2016",
    price: 140000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent2.png",
      name: "Daryl Hawker",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house3.png",
    imageLg: "/assets/img/houses/house3lg.png",
    country: "United States",
    address: "2 Glen Creek St. Alexandria, VA 22304",
    bedrooms: "6",
    bathrooms: "3",
    surface: "4200 sq ft",
    year: "2016",
    price: 170000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent3.png",
      name: "Amado Smith",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 4",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house4.png",
    imageLg: "/assets/img/houses/house4lg.png",
    country: "Canada",
    address: "84 Woodland St. Cocoa, FL 32927",
    bedrooms: "6",
    bathrooms: "3",
    surface: "4200 sq ft",
    year: "2016",
    price: 200000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent4.png",
      name: "Kaitlyn Gonzalez",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 5",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house5.png",
    imageLg: "/assets/img/houses/house5lg.png",
    country: "United States",
    address: "28 Westport Dr. Warminster, PA 18974",
    bedrooms: "5",
    bathrooms: "3",
    surface: "4200 sq ft",
    year: "2015",
    price: 210000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent5.png",
      name: "Grover Robinson",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 6",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house6.png",
    imageLg: "/assets/img/houses/house6lg.png",
    country: "Canada",
    address: "32 Pawnee Street Butte, MT 59701",
    bedrooms: "6",
    bathrooms: "3",
    surface: "6200 sq ft",
    year: "2014",
    price: 220000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent6.png",
      name: "Karen Sorensen",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 1",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a1.png",
    imageLg: "/assets/img/apartments/a1lg.png",
    country: "Canada",
    address: "32 Pawnee Street Butte, MT 59701",
    bedrooms: "2",
    bathrooms: "1",
    surface: "1200 sq ft",
    year: "2012",
    price: 20000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent7.png",
      name: "Jawhar Shamil Naser",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 2",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a2.png",
    imageLg: "/assets/img/apartments/a2lg.png",
    country: "United States",
    address: "28 Westport Dr. Warminster, PA 18974",
    bedrooms: "3",
    bathrooms: "1",
    surface: "1000 sq ft",
    year: "2011",
    price: 30000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent8.png",
      name: "Juana Douglass",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 3",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a3.png",
    imageLg: "/assets/img/apartments/a3lg.png",
    country: "United States",
    address: "84 Woodland St. Cocoa, FL 32927",
    bedrooms: "2",
    bathrooms: "1",
    surface: "1100 sq ft",
    year: "2011",
    price: 40000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent9.png",
      name: "Jerry Schenck",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 7",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house7.png",
    imageLg: "/assets/img/houses/house7lg.png",
    country: "Canada",
    address: "7240C Argyle St. Lawndale, CA 90260",
    bedrooms: "5",
    bathrooms: "3",
    surface: "3200 sq ft",
    year: "2015",
    price: 117000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent10.png",
      name: "Vera Levesque",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 8",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house8.png",
    imageLg: "/assets/img/houses/house8lg.png",
    country: "Canada",
    address: "798 Talbot St. Bridgewater, NJ 08807",
    bedrooms: "7",
    bathrooms: "2",
    surface: "2200 sq ft",
    year: "2019",
    price: 145000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent11.png",
      name: "Sofia Gomes",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 9",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house9.png",
    imageLg: "/assets/img/houses/house9lg.png",
    country: "United States",
    address: "2 Glen Creek St. Alexandria, VA 22304",
    bedrooms: "4",
    bathrooms: "4",
    surface: "4600 sq ft",
    year: "2015",
    price: 139000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent12.png",
      name: "Raymond Hood",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 10",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house10.png",
    imageLg: "/assets/img/houses/house10lg.png",
    country: "Canada",
    address: "84 Woodland St. Cocoa, FL 32927",
    bedrooms: "5",
    bathrooms: "2",
    surface: "5200 sq ft",
    year: "2014",
    price: 180000,
    status: "Đang thuê",
    agent: {
      image: "/assets/img/agents/agent1.png",
      name: "Patricia Tullert",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 11",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house11.png",
    imageLg: "/assets/img/houses/house11lg.png",
    country: "United States",
    address: "28 Westport Dr. Warminster, PA 18974",
    bedrooms: "5",
    bathrooms: "2",
    surface: "3200 sq ft",
    year: "2011",
    price: 213000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent2.png",
      name: "Daryl Hawker",
      phone: "0123 456 78910"
    }
  },
  {
    type: "House",
    name: "House 12",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/houses/house12.png",
    imageLg: "/assets/img/houses/house12lg.png",
    country: "Canada",
    address: "32 Pawnee Street Butte, MT 59701",
    bedrooms: "4",
    bathrooms: "3",
    surface: "5200 sq ft",
    year: "2013",
    price: 221000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent3.png",
      name: "Amado Smith",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 16",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a4.png",
    imageLg: "/assets/img/apartments/a4lg.png",
    country: "Canada",
    address: "32 Pawnee Street Butte, MT 59701",
    bedrooms: "2",
    bathrooms: "1",
    surface: "1300 sq ft",
    year: "2011",
    price: 21000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent4.png",
      name: "Kaitlyn Gonzalez",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 17",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a5.png",
    imageLg: "/assets/img/apartments/a5lg.png",
    country: "United States",
    address: "28 Westport Dr. Warminster, PA 18974",
    bedrooms: "3",
    bathrooms: "1",
    surface: "1000 sq ft",
    year: "2012",
    price: 32000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent5.png",
      name: "Grover Robinson",
      phone: "0123 456 78910"
    }
  },
  {
    type: "Apartment",
    name: "Apartament 18",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, illoat. Repudiandae ratione impedit delectus consectetur. Aspernaturvero obcaecati placeat ab distinctio unde ipsam molestias atqueratione delectus blanditiis nemo eius dignissimos doloremque quaealiquid maiores id tempore consequatur, quod pariatur saepe.",
    image: "/assets/img/apartments/a6.png",
    imageLg: "/assets/img/apartments/a6lg.png",
    country: "Canada",
    address: "84 Woodland St. Cocoa, FL 32927",
    bedrooms: "3",
    bathrooms: "1",
    surface: "1200 sq ft",
    year: "2010",
    price: 38000,
    status: "Trả phòng",
    agent: {
      image: "/assets/img/agents/agent6.png",
      name: "Karen Sorensen",
      phone: "0123 456 78910"
    }
  }
];

const seedHouses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // Clear existing houses
    await House.deleteMany({});
    console.log("🗑️  Cleared existing houses");

    // Insert sample houses
    await House.insertMany(housesData);
    console.log("✅ Seeded houses successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedHouses();
