const mongoose = require('mongoose');
require('dotenv').config();
const Trip = require('./models/Trip');

const sampleTrips = [
  {
    from: 'New York',
    to: 'Boston',
    date: new Date('2024-12-15'),
    time: '09:00',
    price: 48,
    totalSeats: 36,
    seats: []
  },
  {
    from: 'Chicago',
    to: 'Los Angeles',
    date: new Date('2024-12-18'),
    time: '10:30',
    price: 156,
    totalSeats: 36,
    seats: []
  },
  {
    from: 'Atlanta',
    to: 'Miami',
    date: new Date('2024-12-20'),
    time: '14:00',
    price: 129,
    totalSeats: 36,
    seats: []
  },
  {
    from: 'Boston',
    to: 'New York',
    date: new Date('2024-12-15'),
    time: '15:30',
    price: 89,
    totalSeats: 36,
    seats: []
  },
  {
    from: 'Los Angeles',
    to: 'San Francisco',
    date: new Date('2024-12-22'),
    time: '08:00',
    price: 75,
    totalSeats: 36,
    seats: []
  },
  {
    from: 'Miami',
    to: 'Orlando',
    date: new Date('2024-12-25'),
    time: '11:00',
    price: 45,
    totalSeats: 36,
    seats: []
  }
];

async function seedTrips() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing trips
    await Trip.deleteMany({});
    console.log('✅ Cleared existing trips');

    // Create trips one by one to ensure pre-save hook runs
    const trips = [];
    for (const tripData of sampleTrips) {
      const trip = new Trip(tripData);
      await trip.save(); // This will trigger the pre-save hook
      trips.push(trip);
    }

    console.log(`✅ Created ${trips.length} sample trips with seats initialized`);

    // Display created trips
    trips.forEach((trip, index) => {
      console.log(`${index + 1}. ${trip.from} → ${trip.to} - $${trip.price} - ${trip.date.toLocaleDateString()} - ${trip.seats.length} seats`);
    });

    console.log('\n✅ Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding trips:', error);
    process.exit(1);
  }
}

seedTrips();

